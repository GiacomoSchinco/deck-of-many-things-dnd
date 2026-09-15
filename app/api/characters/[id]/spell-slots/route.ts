// app/api/characters/[id]/spell-slots/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase, requireAuth } from '@/lib/supabase/server'

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

  const { error: authErrorPost } = await requireAuth(supabase)
  if (authErrorPost) return authErrorPost

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

// PUT /api/characters/[id]/spell-slots
// Body: { slots: [{ spell_level, total_slots, used_slots }] }
// Usato dal level-up: fa un upsert basato su (character_id, spell_level)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { error: authErrorPut } = await requireAuth(supabase)
  if (authErrorPut) return authErrorPut

  const body = await request.json()
  const { slots } = body as {
    slots: { spell_level: number; total_slots: number; used_slots?: number }[]
  }

  if (!Array.isArray(slots) || slots.length === 0) {
    return NextResponse.json({ error: 'slots richiesto' }, { status: 400 })
  }

  const rows = slots.map((s) => ({
    character_id: id,
    spell_level: s.spell_level,
    total_slots: s.total_slots,
    used_slots: s.used_slots ?? 0,
  }))

  const { data, error } = await supabase
    .from('spell_slots')
    .upsert(rows, { onConflict: 'character_id,spell_level' })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ updated: data?.length ?? 0 })
}

// PATCH /api/characters/[id]/spell-slots
// Body: { spell_level: number, used_slots: number }  — aggiorna gli slot usati
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { error: authErrorPatch } = await requireAuth(supabase)
  if (authErrorPatch) return authErrorPatch

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
