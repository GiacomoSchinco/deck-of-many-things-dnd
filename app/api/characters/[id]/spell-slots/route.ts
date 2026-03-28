// app/api/characters/[id]/spell-slots/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

// GET /api/characters/[id]/spell-slots
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { data, error } = await supabase
    .from('spell_slots')
    .select('*')
    .eq('character_id', id)
    .order('spell_level')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/characters/[id]/spell-slots
// Body: { slots: [{ character_id, spell_level, total, used }] }
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const body = await request.json()
  const { slots } = body as {
    slots: { character_id: string; spell_level: number; total_slots: number; used_slots: number }[]
  }

  if (!Array.isArray(slots) || slots.length === 0) {
    return NextResponse.json({ error: 'slots richiesto' }, { status: 400 })
  }

  const rows = slots.map((s) => ({ ...s, character_id: id }))

  const { data, error } = await supabase
    .from('spell_slots')
    .insert(rows)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ inserted: data?.length ?? 0 })
}

// PATCH /api/characters/[id]/spell-slots
// Body: { spell_level: number, used: number }  — aggiorna gli slot usati
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { spell_level, used_slots } = await request.json()

  const { data, error } = await supabase
    .from('spell_slots')
    .update({ used_slots })
    .eq('character_id', id)
    .eq('spell_level', spell_level)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
