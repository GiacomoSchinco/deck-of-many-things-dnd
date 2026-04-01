import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const search = searchParams.get('search')

  const supabase = createServerSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  let query = supabase.from('items').select('*').order('name')

  if (type && type !== 'all') {
    query = query.eq('type', type)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data: items, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(items)
}

// POST /api/items — crea un nuovo item
export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const body = await request.json()

  const { data: item, error } = await supabase
    .from('items')
    .insert({
      name:        body.name,
      type:        body.type,
      description: body.description ?? null,
      weight:      body.weight ?? 0,
      value:       body.value ?? 0,
      currency:    body.currency ?? 'po',
      rarity:      body.rarity ?? 'common',
      requires_attunement: body.requires_attunement ?? false,
      category:    body.category ?? null,
      properties:  body.properties ?? null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(item, { status: 201 })
}