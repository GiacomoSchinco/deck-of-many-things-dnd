import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase, requireAuth } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)
  
  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(campaign)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const body = await request.json().catch(() => ({})) as { name?: string; dungeon_master_id?: string }

  // fetch current campaign to check ownership
  const { data: existing, error: fetchErr } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchErr || !existing) {
    return NextResponse.json({ error: fetchErr?.message || 'Campagna non trovata' }, { status: 404 })
  }

  if (existing.dungeon_master_id !== user!.id) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const updates: Record<string, unknown> = {}
  if (typeof body.name === 'string') updates.name = body.name
  if (typeof body.dungeon_master_id === 'string') updates.dungeon_master_id = body.dungeon_master_id

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nessun campo da aggiornare' }, { status: 400 })
  }

  const { data: updated, error: updateErr } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  return NextResponse.json(updated)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  // ensure campaign exists and user is DM
  const { data: existing, error: fetchErr } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchErr || !existing) {
    return NextResponse.json({ error: fetchErr?.message || 'Campagna non trovata' }, { status: 404 })
  }

  if (existing.dungeon_master_id !== user!.id) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const { data: deleted, error: delErr } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id)
    .select()

  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 })
  }

  return NextResponse.json({ deleted: deleted?.length ?? 0 })
}