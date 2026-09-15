import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import type { UpdateInventoryItemDTO } from '@/types/inventory'
import type { Database } from '@/lib/supabase/types'

type InventoryUpdate = Database['public']['Tables']['inventory']['Update']

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

  const body = (await request.json()) as UpdateInventoryItemDTO

  const payload: Partial<UpdateInventoryItemDTO> = {}

  if (body.name !== undefined) payload.name = body.name ?? null
  if (body.type !== undefined) payload.type = body.type ?? null
  if (body.item_id !== undefined) payload.item_id = body.item_id ?? null
  if (body.quantity != null) payload.quantity = Math.max(1, Math.trunc(Number(body.quantity)))
  if (body.weight != null) payload.weight = Number(body.weight)
  if (body.equipped != null) payload.equipped = !!body.equipped
  if (body.description !== undefined) payload.description = body.description ?? null
  if (body.notes !== undefined) payload.notes = body.notes ?? null
  if (body.properties !== undefined) payload.properties = body.properties
  if (body.value != null) payload.value = Number(body.value)
  if (body.currency !== undefined) payload.currency = body.currency ?? null

  const { data, error } = await supabase
    .from('inventory')
    .update(payload as unknown as InventoryUpdate)
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