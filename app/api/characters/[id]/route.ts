import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

//GET /api/characters/[id] -> personaggio specifico con TUTTI i dettagli
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params

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

  // Carica personaggio con TUTTI i dettagli
  const { data: character, error } = await supabase
    .from('characters')
    .select(`
      *,
      races:race_id (*),
      classes:class_id (*),
      campaigns:campaign_id (*),
      ability_scores (*),
      combat_stats (*),
      inventory (*),
      features (*),
      spells_known (
        *,
        spells:spell_id (*)
      ),
      spell_slots (*),
      notes (*)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(character)
}

// ✏️ PUT - Aggiornamento personaggio
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
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
    // Aggiorna personaggio
    const { data: character, error: charError } = await supabase
      .from('characters')
      .update({
        name: body.name,
        player_name: body.playerName,
        campaign_id: body.campaignId,
        race_id: body.raceId,
        class_id: body.classId,
        level: body.level,
        experience: body.experience,
        background: body.background,
        alignment: body.alignment,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (charError) throw charError

    // Aggiorna ability scores se presenti
    if (body.abilityScores) {
      const { error: scoresError } = await supabase
        .from('ability_scores')
        .upsert({
          character_id: id,
          strength: body.abilityScores.strength,
          dexterity: body.abilityScores.dexterity,
          constitution: body.abilityScores.constitution,
          intelligence: body.abilityScores.intelligence,
          wisdom: body.abilityScores.wisdom,
          charisma: body.abilityScores.charisma,
        })

      if (scoresError) throw scoresError
    }

    // Aggiorna combat stats se presenti
    if (body.combatStats) {
      const { error: combatError } = await supabase
        .from('combat_stats')
        .upsert({
          character_id: id,
          ...body.combatStats
        })

      if (combatError) throw combatError
    }

    return NextResponse.json(character)
    
  } catch (error) {
    console.error('Errore aggiornamento personaggio:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento del personaggio' },
      { status: 500 }
    )
  }
}

// 🗑️ DELETE - Eliminazione personaggio
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params

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

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { error } = await supabase
    .from('characters')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}