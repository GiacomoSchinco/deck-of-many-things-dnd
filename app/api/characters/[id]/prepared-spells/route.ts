// app/api/characters/[id]/prepared-spells/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase, requireAuth } from '@/lib/supabase/server'

// GET /api/characters/[id]/prepared-spells
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { data, error } = await supabase
    .from('prepared_spells')
    .select(`
      *,
      spell:spells (*)
    `)
    .eq('character_id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/characters/[id]/prepared-spells
// Body: { spell_ids: number[] }
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const body = await request.json().catch(() => ({})) as { spell_ids?: number[] }
  const { spell_ids } = body

  if (!Array.isArray(spell_ids) || spell_ids.length === 0) {
    return NextResponse.json({ error: 'spell_ids richiesto' }, { status: 400 })
  }

  const rows = spell_ids.map((spell_id: number) => ({
    character_id: id,
    spell_id,
  }))

  const { data, error } = await supabase
    .from('prepared_spells')
    .upsert(rows, { onConflict: 'character_id,spell_id' })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ inserted: data?.length ?? 0 })
}

// DELETE /api/characters/[id]/prepared-spells
// Body: { spell_ids: number[] }
export async function DELETE(
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

  const body = await request.json().catch(() => ({})) as { spell_ids?: number[] }
  const { spell_ids } = body

  if (!Array.isArray(spell_ids) || spell_ids.length === 0) {
    return NextResponse.json({ error: 'spell_ids richiesto' }, { status: 400 })
  }

  const { error } = await supabase
    .from('prepared_spells')
    .delete()
    .eq('character_id', id)
    .in('spell_id', spell_ids)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ deleted: spell_ids.length })
}
