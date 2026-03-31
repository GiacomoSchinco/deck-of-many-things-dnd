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

  // Personaggi di una campagna specifica
  const { data: characters, error } = await supabase
    .from('characters')
    .select(`
      *,
      races:race_id (name),
      classes:class_id (name)
    `)
    .eq('campaign_id', id)
    .order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(characters)
}

// POST /api/characters/campaign/[id] — aggiungi personaggi alla campagna
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  // check DM ownership
  const { data: campaign, error: campErr } = await supabase
    .from('campaigns')
    .select('dungeon_master_id')
    .eq('id', id)
    .single()

  if (campErr || !campaign) return NextResponse.json({ error: campErr?.message || 'Campagna non trovata' }, { status: 404 })
  if (campaign.dungeon_master_id !== user.id) return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 })

  const body = await request.json().catch(() => ({})) as { character_ids?: string[] }
  const { character_ids = [] } = body
  if (!Array.isArray(character_ids) || character_ids.length === 0) {
    return NextResponse.json({ error: 'character_ids richiesti' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('characters')
    .update({ campaign_id: id })
    .in('id', character_ids)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ updated: data?.length ?? 0, characters: data })
}

// DELETE /api/characters/campaign/[id] — rimuovi personaggi dalla campagna (set campaign_id = null)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })

  // check DM ownership
  const { data: campaign, error: campErr } = await supabase
    .from('campaigns')
    .select('dungeon_master_id')
    .eq('id', id)
    .single()

  if (campErr || !campaign) return NextResponse.json({ error: campErr?.message || 'Campagna non trovata' }, { status: 404 })
  if (campaign.dungeon_master_id !== user.id) return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 })

  const body = await request.json().catch(() => ({})) as { character_ids?: string[] }
  const { character_ids = [] } = body
  if (!Array.isArray(character_ids) || character_ids.length === 0) {
    return NextResponse.json({ error: 'character_ids richiesti' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('characters')
    .update({ campaign_id: null })
    .in('id', character_ids)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ updated: data?.length ?? 0, characters: data })
}