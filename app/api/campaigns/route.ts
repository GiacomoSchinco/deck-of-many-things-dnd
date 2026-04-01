// app/api/classes/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      characters:characters(count)
    `)
    .order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(campaigns)
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerSupabase(cookieStore)
  const body = await request.json().catch(() => ({})) as { name?: string; description?: string }
  const { name, description } = body

  if (!name || name.trim() === '') {
    return NextResponse.json({ error: 'Il nome della campagna è obbligatorio' }, { status: 400 })
  }

  // require authenticated user and set them as dungeon master by default
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .insert({ name, description: description ?? null, created_by: user.id, dungeon_master_id: user.id })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(campaign)
}
