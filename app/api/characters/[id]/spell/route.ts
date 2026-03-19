// app/api/characters/[id]/spells/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params

  const supabase = createServerSupabase(cookieStore)

  const { data: spells, error } = await supabase
    .from('spells_known')
    .select(`
      *,
      spells (*)
    `)
    .eq('character_id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(spells)
}