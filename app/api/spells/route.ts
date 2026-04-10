// app/api/spells/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase, requireAuth } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const { searchParams } = new URL(request.url)
  const classFilter = searchParams.get('class')
  const levelFilter = searchParams.get('level')
  const schoolFilter = searchParams.get('school')
  const searchFilter = searchParams.get('search')

  const supabase = createServerSupabase(cookieStore)
  
  let query = supabase
    .from('spells')
    .select('*')
    .order('level')
    .order('name')

  if (classFilter) {
    query = query.contains('classes', [classFilter])
  }

  if (levelFilter) {
    query = query.eq('level', parseInt(levelFilter))
  }
  if (schoolFilter) {
    query = query.eq('school', schoolFilter)
  }
  if (searchFilter) {
    const s = `%${searchFilter}%`
    query = query.or(`name.ilike.${s},description.ilike.${s}`)
  }

  const { data: spells, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(spells)
}

// POST /api/spells — crea una nuova spell
export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerSupabase(cookieStore)

  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return authError

  const body = await request.json()

  const { data: spell, error } = await supabase
    .from('spells')
    .insert({
      name:          body.name,
      level:         body.level,
      school:        body.school,
      casting_time:  body.casting_time,
      range:         body.range,
      components:    body.components,
      duration:      body.duration,
      description:   body.description,
      higher_levels: body.higher_levels ?? null,
      classes:       body.classes ?? [],
      ritual:        body.ritual ?? false,
      concentration: body.concentration ?? false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(spell, { status: 201 })
}