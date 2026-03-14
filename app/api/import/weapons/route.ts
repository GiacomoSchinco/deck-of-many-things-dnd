import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ solo backend
);

const OPEN5E_URL = "https://api.open5e.com/weapons/";

// Scarica tutte le pagine dai endpoints Open5e
async function fetchAllOpen5e(url: string) {
  let results: any[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    const res: Response = await fetch(nextUrl);
    const data = await res.json();
    results = [...results, ...data.results];
    nextUrl = data.next;
  }

  return results;
}

export async function GET() {
  try {
    // 1) prendo tutte le armi dal API
    const allWeapons = await fetchAllOpen5e(OPEN5E_URL);

    // 2) converto i dati PER LA TUA TABELLA
    const mapped = allWeapons.map((w: any) => ({
      name: w.name ?? null,
      category: w.category ?? null,
      cost: w.cost ?? null,
      damage: w.damage ?? null,
      damage_type: w.damage_type ?? null,
      weight: w.weight ? parseFloat(w.weight) : null,
      properties: Array.isArray(w.properties)
        ? w.properties.map((p: any) => typeof p === "string" ? p.trim() : String(p))
        : typeof w.properties === "string"
          ? w.properties.split(",").map((p: string) => p.trim())
          : [],
    }));

    // Rimuovo i duplicati per name
    const uniqueByName = Object.values(
      mapped.reduce((acc, item) => {
        if (!acc[item.name]) acc[item.name] = item;
        return acc;
      }, {} as Record<string, typeof mapped[0]>)
    );

    // 3) Inserimento con UPSERT → niente duplicati
    const { data, error } = await supabase
      .from("weapons")
      .upsert(uniqueByName, { onConflict: "name" });

    if (error) {
      return NextResponse.json({ status: "error", error }, { status: 500 });
    }

    return NextResponse.json({
      status: "success",
      imported: mapped.length,
    });

  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message });
  }
}
