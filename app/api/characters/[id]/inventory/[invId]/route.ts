import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: Request, { params }: { params: Promise<{ id: string; invId: string }> }) {
  const cookieStore = await cookies()
  const { id, invId } = await params
  const supabase = createServerSupabase(cookieStore)

  const { data: row, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('character_id', id)
    .eq('id', invId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(row)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string; invId: string }> }) {
  const cookieStore = await cookies()
  const { id, invId } = await params
  const supabase = createServerSupabase(cookieStore)

  const body = await request.json()
  const allowed = {
    item_name: body.item_name,
    item_id: body.item_id ?? null,
    item_type: body.item_type ?? null,
    quantity: body.quantity != null ? Math.max(1, Math.trunc(Number(body.quantity))) : undefined,
    weight: body.weight != null ? Number(body.weight) : undefined,
    equipped: body.equipped != null ? !!body.equipped : undefined,
    description: body.description ?? undefined,
    notes: body.notes ?? undefined,
    // per-row `value` and `currency` are not stored on inventory rows
    properties: body.properties ?? undefined,
  }

  // remove undefined keys
  const payload: any = {}
  Object.keys(allowed).forEach((k) => {
    if (allowed[k as keyof typeof allowed] !== undefined) payload[k] = (allowed as any)[k]
  })

  const { data, error } = await supabase
    .from('inventory')
    .update(payload)
    .eq('character_id', id)
    .eq('id', invId)
    .select()
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; invId: string }> }) {
  const cookieStore = await cookies()
  const { id, invId } = await params
  const supabase = createServerSupabase(cookieStore)

  const { error } = await supabase.from('inventory').delete().eq('character_id', id).eq('id', invId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
