
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ solo backend
);

const OPEN5E_URL = "https://api.open5e.com/classes/";

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
    const allClasses = await fetchAllOpen5e(OPEN5E_URL);
    let imported = 0;
    for (const c of allClasses) {
      // 1. Document (fonte)
      let document_id: string | null = null;
      if (c.document__slug) {
        const { data: docData, error: docError } = await supabase
          .from("documents")
          .upsert([{
            slug: c.document__slug,
            title: c.document__title,
            license_url: c.document__license_url,
            url: c.document__url,
          }], { onConflict: "slug" })
          .select("id");
        if (docError) return NextResponse.json({ status: "error", error: docError }, { status: 500 });
        document_id = docData?.[0]?.id ?? null;
      }

      // 2. Classe principale
      const { data: classData, error: classError } = await supabase
        .from("classes")
        .upsert([{
          name: c.name,
          slug: c.slug,
          description: c.desc,
          hit_die: c.hit_dice ? parseInt(c.hit_dice.replace("d", "")) : null,
          spellcasting_ability: c.spellcasting_ability,
          hp_at_1st_level: c.hp_at_1st_level,
          hp_at_higher_levels: c.hp_at_higher_levels,
          subtypes_name: c.subtypes_name,
          primary_ability: Array.isArray(c.primary_ability)
            ? c.primary_ability.join(", ")
            : c.primary_ability ?? null,
          document_id,
        }], { onConflict: "name" })
        .select("id");
      if (classError) return NextResponse.json({ status: "error", error: classError }, { status: 500 });
      const class_id = classData?.[0]?.id;
      if (!class_id) continue;

      // 3. Archetypes (sottoclassi)
      if (Array.isArray(c.archetypes)) {
        for (const a of c.archetypes) {
          await supabase.from("archetypes").upsert([{
            class_id,
            name: a.name,
            slug: a.slug,
            description: a.desc,
            document_id,
          }], { onConflict: "slug" });
        }
      }

      // 4. Equipment
      if (c.equipment) {
        await supabase.from("equipment").upsert([{
          class_id,
          equipment_text: c.equipment,
        }], { onConflict: "class_id" });
      }

      // 5. Proficiencies
      await supabase.from("proficiencies").upsert([{
        class_id,
        armor: c.prof_armor ?? null,
        weapons: c.prof_weapons ?? null,
        tools: c.prof_tools ?? null,
        saving_throws: c.prof_saving_throws ?? null,
        skills: c.prof_skills ?? null,
      }], { onConflict: "class_id" });

      // 6. Progressione livelli (class_tables) - parsing tabella markdown
      if (c.table) {
        // Semplificato: salva la tabella markdown come testo, oppure puoi parsare in array di oggetti
        await supabase.from("class_tables").upsert([{
          class_id,
          level: null,
          proficiency_bonus: null,
          features: null,
          cantrips_known: null,
          spell_slots: null,
          // puoi aggiungere un campo "table_markdown" se vuoi
        }]);
      }
      imported++;
    }
    return NextResponse.json({
      status: "success",
      imported_or_updated: imported,
    });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message });
  }
}
