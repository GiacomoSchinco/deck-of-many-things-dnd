import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase, requireAuth } from '@/lib/supabase/server'
//GET /api/characters -> lista personaggi dell'utente loggato
export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerSupabase(cookieStore)

  // TUTTI i personaggi (admin)
  const { data: characters, error } = await supabase
    .from('characters')
    .select(`
      *,
      races:race_id (name),
      classes:class_id (name),
      campaigns:campaign_id (name, dungeon_master)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(characters)
}

// POST /api/characters -> crea nuovo personaggio
export async function POST(request: Request) {
  const cookieStore = await cookies()

  // 1. Body malformato (JSON non valido)
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corpo della richiesta non valido' }, { status: 400 })
  }

  const supabase = createServerSupabase(cookieStore)

  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  // 3. Validazione campi obbligatori
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) {
    return NextResponse.json({ error: 'Il nome del personaggio è obbligatorio' }, { status: 400 })
  }
  if (!body.raceId) {
    return NextResponse.json({ error: 'La razza è obbligatoria' }, { status: 400 })
  }
  if (!body.classId) {
    return NextResponse.json({ error: 'La classe è obbligatoria' }, { status: 400 })
  }

  try {
    // 4. Controlla duplicati: stesso nome (case-insensitive) per lo stesso utente
    const { data: existing } = await supabase
      .from('characters')
      .select('id')
      .eq('user_id', user.id)
      .ilike('name', name)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: `Hai già un personaggio di nome "${name}"` },
        { status: 409 }
      )
    }

    // 5. Verifica che raceId e classId esistano
    const [{ error: raceErr }, { error: classErr }] = await Promise.all([
      supabase.from('races').select('id').eq('id', body.raceId as number).single(),
      supabase.from('classes').select('id').eq('id', body.classId as number).single(),
    ])
    if (raceErr) {
      return NextResponse.json({ error: 'Razza non valida' }, { status: 400 })
    }
    if (classErr) {
      return NextResponse.json({ error: 'Classe non valida' }, { status: 400 })
    }

    // 6. Inserisci personaggio
    const { data: character, error: charError } = await supabase
      .from('characters')
      .insert({
        user_id: user.id,
        name,
        player_name: body.playerName || null,
        campaign_id: body.campaignId || null,
        race_id: body.raceId,
        class_id: body.classId,
        level: body.level || 1,
        experience: body.experience || 0,
        background: body.background || null,
        alignment: body.alignment || null,
      } as any)
      .select()
      .single()

    if (charError) throw charError

    // 7. Inserisci ability scores
    if (body.abilityScores && typeof body.abilityScores === 'object') {
      const as = body.abilityScores as Record<string, number>
      const { error: scoresError } = await supabase
        .from('ability_scores')
        .insert({
          character_id: character.id,
          strength:     as.strength,
          dexterity:    as.dexterity,
          constitution: as.constitution,
          intelligence: as.intelligence,
          wisdom:       as.wisdom,
          charisma:     as.charisma,
        })

      if (scoresError) throw scoresError
    }

    // 8. Inserisci combat stats
    if (body.combatStats && typeof body.combatStats === 'object') {
      const cs = body.combatStats as Record<string, unknown>
      const { error: combatError } = await supabase
        .from('combat_stats')
        .insert({
          character_id:     character.id,
          max_hp:           cs.max_hp,
          current_hp:       cs.current_hp,
          temp_hp:          cs.temp_hp          ?? 0,
          hit_dice_type:    cs.hit_dice_type,
          hit_dice_total:   cs.hit_dice_total   ?? 1,
          hit_dice_used:    cs.hit_dice_used    ?? 0,
          armor_class:      cs.armor_class,
          initiative_bonus: cs.initiative_bonus ?? 0,
          speed:            cs.speed            ?? 30,
          inspiration:      cs.inspiration      ?? false,
        } as any)

      if (combatError) throw combatError
    }

    return NextResponse.json(character, { status: 201 })
    
  } catch (error) {
    console.error('Errore creazione personaggio:', error)
    return NextResponse.json(
      { error: 'Errore durante la creazione del personaggio' },
      { status: 500 }
    )
  }
}