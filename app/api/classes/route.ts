// app/api/classes/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerSupabase(cookieStore)
  
  const { data: classes, error } = await supabase
    .from('classes')
    .select('*')
    .order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(classes)
}