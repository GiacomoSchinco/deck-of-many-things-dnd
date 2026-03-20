// app/api/characters/[id]/saving-throws/route.ts
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
      .from('saving_throws')
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
// app/api/characters/[id]/saving-throws/route.ts (aggiungi POST)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const { id } = await params
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

    const body = await request.json()
    const saves = body?.saving_throws

    if (!Array.isArray(saves)) {
      return NextResponse.json({ error: 'saving_throws deve essere un array' }, { status: 400 })
    }

    const rows = saves.map((save: any) => ({
      character_id: id,
      ability: save.ability,
      proficient: save.proficient || false
    }))

    const { data, error } = await supabase
      .from('saving_throws')
      .upsert(rows, { onConflict: 'character_id,ability' })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ inserted: data?.length || 0, saving_throws: data })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore interno' },
      { status: 500 }
    )
  }
}