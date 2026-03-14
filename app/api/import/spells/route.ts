import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // solo lato server
);


const OPEN5E_URL = "https://api.open5e.com/spells/";

function parseSpellLevel(raw: any): number {
  if (raw === null || raw === undefined) return 0;

  // Se è già numero (es. 3)
  if (typeof raw === "number") return raw;

  // Se è "Cantrip"
  if (typeof raw === "string" && raw.toLowerCase().includes("cantrip"))
    return 0;

  // Se è tipo "4th-level" → estrai il numero iniziale
  const num = parseInt(raw);
  if (!isNaN(num)) return num;

  // fallback
  return 0;
}


async function fetchAllOpen5e(url: string) {
  let results: any[] = [];
  let nextUrl: string | null = url;

  // ciclo per prendere OGNI pagina
  while (nextUrl) {
    const res: Response = await fetch(nextUrl);
    const data = await res.json();

    results = [...results, ...data.results];
    nextUrl = data.next;
  }
console.log(`Fetched ${results.length} spells from Open5e.`);
  return results;
}

export async function GET() {
  try {
    // 1️⃣ scarica tutti gli incantesimi da Open5e
    const allSpells = await fetchAllOpen5e(OPEN5E_URL);

    // 2️⃣ mappa i dati per combaciare esattamente con la tua tabella
    const mapped = allSpells.map((spell: any) => ({
      slug: spell.slug ?? null,
      name: spell.name ?? null,
      level: parseSpellLevel(spell.level),
      school: spell.school ?? null,
      casting_time: spell.casting_time ?? null,
      range: spell.range ?? null,
      components: spell.components ?? null,
      duration: spell.duration ?? null,
      description: spell.desc ?? null,
      higher_level: spell.higher_level ?? null,

      // ⚡ Convertiamo "Wizard, Sorcerer" → ["Wizard", "Sorcerer"]
      classes: spell.dnd_class
        ? spell.dnd_class.split(",").map((c: string) => c.trim())
        : [],

      // Fonte ufficiale
      source: spell.document__title ?? null,
    }));

    // Rimuovo i duplicati per name
    const uniqueByName = Object.values(
      mapped.reduce((acc, item) => {
        if (!acc[item.name]) acc[item.name] = item;
        return acc;
      }, {} as Record<string, typeof mapped[0]>)
    );

    // 3️⃣ Bulk upsert nel tuo Supabase
    const { error } = await supabase.from("spells").upsert(uniqueByName, { onConflict: "name" });

    if (error) {
      return NextResponse.json(
        { status: "error", error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      imported: mapped.length,
    });
  } catch (e: any) {
    return NextResponse.json({
      status: "error",
      message: e.message,
    });
  }
}
