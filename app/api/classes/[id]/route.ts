// app/api/races/[id]/route.ts
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
  
  const { data: classData, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', parseInt(id))
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(classData)
}