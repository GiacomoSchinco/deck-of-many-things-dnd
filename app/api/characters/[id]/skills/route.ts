// app/api/characters/[id]/skills/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const { id } = await params
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

    const { data, error } = await supabase
      .from('skill_proficiencies')
      .select('*')
      .eq('character_id', id)

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const { id } = await params
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
    const skills = body?.skills

    if (!Array.isArray(skills)) {
      return NextResponse.json({ error: 'skills deve essere un array' }, { status: 400 })
    }

    // 🔥 CAMBIO: usa skill_id invece di skill_name
    const rows = skills.map((skill: any) => ({
      character_id: id,
      skill_id: skill.skill_id,           // ← ora è ID numerico
      proficiency_type: skill.proficiency_type || 'proficient'
    }))

    const { data, error } = await supabase
      .from('skill_proficiencies')
      .upsert(rows, { onConflict: 'character_id,skill_id' })  // ← conflitto su skill_id
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ inserted: data?.length || 0, skills: data })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore interno' },
      { status: 500 }
    )
  }
}