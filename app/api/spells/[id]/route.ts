// app/api/spells/[id]/route.ts
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
  
  const { data: spell, error } = await supabase
    .from('spells')
    .select('*')
    .eq('id', parseInt(id))
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(spell)
}

// PUT /api/spells/[id] — aggiorna una spell
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

  const { data: spell, error } = await supabase
    .from('spells')
    .update({
      name:          body.name,
      level:         body.level,
      school:        body.school,
      casting_time:  body.casting_time,
      range:         body.range,
      components:    body.components,
      duration:      body.duration,
      description:   body.description,
      higher_levels: body.higher_levels ?? null,
      classes:       body.classes,
      ritual:        body.ritual,
      concentration: body.concentration,
    })
    .eq('id', parseInt(id))
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(spell)
}

// DELETE /api/spells/[id] — elimina una spell
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
    .from('spells')
    .delete()
    .eq('id', parseInt(id))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new Response(null, { status: 204 })
}