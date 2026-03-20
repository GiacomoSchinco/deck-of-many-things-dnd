import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

// GET /api/characters/[id]/combat-stats
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  // Verifica che il personaggio appartenga all'utente
  const { data: character, error: charError } = await supabase
    .from('characters')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (charError || !character) {
    return NextResponse.json({ error: 'Personaggio non trovato' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('combat_stats')
    .select('*')
    .eq('character_id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

// PUT /api/characters/[id]/combat-stats
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const body = await request.json()
  const supabase = createServerSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  // Verifica che il personaggio appartenga all'utente
  const { data: character, error: charError } = await supabase
    .from('characters')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (charError || !character) {
    return NextResponse.json({ error: 'Personaggio non trovato' }, { status: 404 })
  }

  // Mappa esplicita delle colonne — nessun campo sconosciuto arriva al DB
  const { data, error } = await supabase
    .from('combat_stats')
    .upsert({
      character_id: id,
      max_hp:         body.max_hp,
      current_hp:     body.current_hp,
      temp_hp:        body.temp_hp        ?? 0,
      hit_dice_type:  body.hit_dice_type,
      hit_dice_total: body.hit_dice_total  ?? 1,
      hit_dice_used:  body.hit_dice_used   ?? 0,
      armor_class:    body.armor_class,
      initiative_bonus: body.initiative_bonus ?? 0,
      speed:          body.speed           ?? 30,
      inspiration:    body.inspiration     ?? false,
    })
    .eq('character_id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
