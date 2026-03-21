// app/api/characters/[id]/saving-throws/[ability]/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

// PUT - Aggiorna un tiro salvezza specifico
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; ability: string }> }
) {
  try {
    const cookieStore = await cookies()
    const { id, ability } = await params
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
    const { proficient } = body

    const { data, error } = await supabase
      .from('saving_throws')
      .update({ proficient })
      .eq('character_id', id)
      .eq('ability', ability)
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

// DELETE - Rimuove un tiro salvezza (se un talento lo rimuove, ma raro)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; ability: string }> }
) {
  try {
    const cookieStore = await cookies()
    const { id, ability } = await params
    const supabase = createServerSupabase(cookieStore)

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
      .from('saving_throws')
      .delete()
      .eq('character_id', id)
      .eq('ability', ability)

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