import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase, requireAuth } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

// Helper per verificare se l'utente è admin
async function isAdmin(supabase: SupabaseClient<Database>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  return profile?.role === 'admin'
}

// GET /api/characters/[id] -> personaggio specifico con TUTTI i dettagli
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  // Ottieni l'utente loggato
  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const admin = await isAdmin(supabase)

  // Costruisci la query base
  let query = supabase
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

  // Se non è admin, filtra per user_id\n  if (!admin) {\n    query = query.eq('user_id', user!.id)\n  }

  const { data: character, error } = await query.single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(character)
}

// PUT - Aggiornamento personaggio
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const body = await request.json()

  const supabase = createServerSupabase(cookieStore)

  const { user: userPut, error: authErrorPut } = await requireAuth(supabase)
  if (authErrorPut) return authErrorPut

  const admin = await isAdmin(supabase)

  try {
    // Costruisci la query di update
    let updateQuery = supabase
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

    // Se non è admin, filtra per user_id
    if (!admin) {
      updateQuery = updateQuery.eq('user_id', userPut!.id)
    }

    const { data: character, error: charError } = await updateQuery.select().single()

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
        .update(body.combatStats)
        .eq('character_id', id)

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

// DELETE - Eliminazione personaggio
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { user: userDel, error: authErrorDel } = await requireAuth(supabase)
  if (authErrorDel) return authErrorDel

  const admin = await isAdmin(supabase)

  let deleteQuery = supabase
    .from('characters')
    .delete()
    .eq('id', id)

  // Se non è admin, filtra per user_id
  if (!admin) {
    deleteQuery = deleteQuery.eq('user_id', userDel!.id)
  }

  const { error } = await deleteQuery

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}