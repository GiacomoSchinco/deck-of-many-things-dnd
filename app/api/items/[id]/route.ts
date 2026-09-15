import { cookies } from 'next/headers'
import { createServerSupabase, requireAuth } from '@/lib/supabase/server'
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

  const { error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const body = await request.json()

  const { data: item, error } = await supabase
    .from('items')
    .update({
      name:                body.name,
      type:                body.type,
      description:         body.description ?? null,
      weight:              body.weight,
      value:               body.value ?? 0,
      currency:            body.currency ?? 'po',
      rarity:              body.rarity,
      requires_attunement: body.requires_attunement,
      category:            body.category ?? null,
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

  const { error: authError2 } = await requireAuth(supabase)
  if (authError2) return authError2

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', parseInt(id))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new Response(null, { status: 204 })
}