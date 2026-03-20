// app/api/characters/[id]/skills/[skillId]/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; skillId: string }> }
) {
  try {
    const cookieStore = await cookies()
    const { id, skillId } = await params
    const supabase = createServerSupabase(cookieStore)

    // Verifica proprietà
    const { data: character } = await supabase
      .from('characters')
      .select('user_id')
      .eq('id', id)
      .single()

    const { data: { user } } = await supabase.auth.getUser()

    if (character?.user_id !== user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const body = await request.json()
    const { proficiency_type } = body

    const { data, error } = await supabase
      .from('skill_proficiencies')
      .update({ proficiency_type })
      .eq('character_id', id)
      .eq('skill_id', parseInt(skillId))
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore interno' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; skillId: string }> }
) {
  try {
    const cookieStore = await cookies()
    const { id, skillId } = await params
    const supabase = createServerSupabase(cookieStore)

    // Verifica proprietà
    const { data: character } = await supabase
      .from('characters')
      .select('user_id')
      .eq('id', id)
      .single()

    const { data: { user } } = await supabase.auth.getUser()

    if (character?.user_id !== user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { error } = await supabase
      .from('skill_proficiencies')
      .delete()
      .eq('character_id', id)
      .eq('skill_id', parseInt(skillId))

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore interno' },
      { status: 500 }
    )
  }
}