// app/api/characters/[id]/spells/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params

  const supabase = createServerSupabase(cookieStore)

  const { data: spells, error } = await supabase
    .from('spells_known')
    .select(`
      *,
      spells (*)
    `)
    .eq('character_id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(spells)
}

// POST /api/characters/[id]/spells
// Body: { spell_ids: number[], prepared?: boolean }
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params

  const supabase = createServerSupabase(cookieStore)

  // Verifica autenticazione
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const body = await request.json()
  const { spell_ids, prepared = false } = body as { spell_ids: number[]; prepared?: boolean }

  if (!Array.isArray(spell_ids) || spell_ids.length === 0) {
    return NextResponse.json({ error: 'spell_ids richiesto' }, { status: 400 })
  }

  const rows = spell_ids.map((spell_id: number) => ({
    character_id: id,
    spell_id,
    prepared,
  }))

  const { data, error } = await supabase
    .from('spells_known')
    .insert(rows)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ inserted: data?.length ?? 0 })
}

// DELETE /api/characters/[id]/spells
// Body: { known_ids?: number[], spell_ids?: number[] }
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params

  const supabase = createServerSupabase(cookieStore)

  // Verifica autenticazione
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({})) as { known_ids?: string[]; spell_ids?: number[] }
  const { known_ids = [], spell_ids = [] } = body

  if ((!Array.isArray(known_ids) || known_ids.length === 0) && (!Array.isArray(spell_ids) || spell_ids.length === 0)) {
    return NextResponse.json({ error: 'known_ids or spell_ids richiesti' }, { status: 400 })
  }

  try {
    let totalDeleted = 0

    if (Array.isArray(known_ids) && known_ids.length > 0) {
      const { data, error } = await supabase
        .from('spells_known')
        .delete()
        .in('id', known_ids)
        .eq('character_id', id)
        .select()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      totalDeleted += data?.length ?? 0
    }

    if (Array.isArray(spell_ids) && spell_ids.length > 0) {
      const { data, error } = await supabase
        .from('spells_known')
        .delete()
        .in('spell_id', spell_ids)
        .eq('character_id', id)
        .select()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      totalDeleted += data?.length ?? 0
    }

    return NextResponse.json({ deleted: totalDeleted })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Errore eliminazione' }, { status: 500 })
  }
}