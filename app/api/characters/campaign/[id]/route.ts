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

  // Personaggi di una campagna specifica
  const { data: characters, error } = await supabase
    .from('characters')
    .select(`
      *,
      races:race_id (name),
      classes:class_id (name)
    `)
    .eq('campaign_id', id)
    .order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(characters)
}