// app/api/spellcasting-progression/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

// GET /api/spellcasting-progression?class=wizard&level=1
export async function GET(request: Request) {
  const cookieStore = await cookies()
  const { searchParams } = new URL(request.url)
  const className = searchParams.get('class')
  const level = searchParams.get('level')

  const supabase = createServerSupabase(cookieStore)

  let query = supabase
    .from('spellcasting_progression')
    .select('*')
    .order('class_name')
    .order('level')

  if (className) {
    query = query.eq('class_name', className.toLowerCase())
  }

  if (level) {
    query = query.eq('level', parseInt(level))
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Se richiesta singola (class + level), restituisce oggetto invece di array
  if (className && level) {
    return NextResponse.json(data?.[0] ?? null)
  }

  return NextResponse.json(data)
}
