import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
//GET /api/characters -> lista personaggi dell'utente loggato
export async function GET() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

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
  const body = await request.json()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // Ottieni l'utente loggato
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  try {
    // 1. Inserisci personaggio
    const { data: character, error: charError } = await supabase
      .from('characters')
      .insert({
        user_id: user.id,
        name: body.name,
        player_name: body.playerName || null,
        campaign_id: body.campaignId || null,
        race_id: body.raceId,
        class_id: body.classId,
        level: body.level || 1,
        experience: body.experience || 0,
        background: body.background,
        alignment: body.alignment,
      })
      .select()
      .single()

    if (charError) throw charError

    // 2. Inserisci ability scores
    if (body.abilityScores) {
      const { error: scoresError } = await supabase
        .from('ability_scores')
        .insert({
          character_id: character.id,
          strength: body.abilityScores.strength,
          dexterity: body.abilityScores.dexterity,
          constitution: body.abilityScores.constitution,
          intelligence: body.abilityScores.intelligence,
          wisdom: body.abilityScores.wisdom,
          charisma: body.abilityScores.charisma,
        })

      if (scoresError) throw scoresError
    }

    // 3. Inserisci combat stats
    if (body.combatStats) {
      const cs = body.combatStats
      const { error: combatError } = await supabase
        .from('combat_stats')
        .insert({
          character_id:    character.id,
          max_hp:          cs.max_hp,
          current_hp:      cs.current_hp,
          temp_hp:         cs.temp_hp          ?? 0,
          hit_dice_type:   cs.hit_dice_type,
          hit_dice_total:  cs.hit_dice_total   ?? 1,
          hit_dice_used:   cs.hit_dice_used    ?? 0,
          armor_class:     cs.armor_class,
          initiative_bonus: cs.initiative_bonus ?? 0,
          speed:           cs.speed            ?? 30,
          inspiration:     cs.inspiration      ?? false,
        })

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