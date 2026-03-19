import { cookies } from 'next/headers'
import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)
  
  const { data: item, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', parseInt(id))
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(item)
}

// PUT /api/items/[id] — aggiorna un item
export async function PUT(
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

  const { data: item, error } = await supabase
    .from('items')
    .update({
      name:                body.name,
      type:                body.type,
      description:         body.description ?? null,
      weight:              body.weight,
      cost:                body.cost ?? null,
      cost_unit:           body.cost_unit,
      rarity:              body.rarity,
      requires_attunement: body.requires_attunement,
      properties:          body.properties ?? null,
    })
    .eq('id', parseInt(id))
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(item)
}

// DELETE /api/items/[id] — elimina un item
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

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', parseInt(id))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new Response(null, { status: 204 })
}