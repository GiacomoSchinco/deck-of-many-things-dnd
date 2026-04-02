// app/api/equipment/presets/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { CreateEquipmentPresetDTO } from '@/types/equipment'

// GET /api/equipment/presets - Lista tutti i preset
export async function GET(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerSupabase(cookieStore)
  const { searchParams } = new URL(request.url)
  
  const classId = searchParams.get('class_id')
  const isDefault = searchParams.get('is_default')

  let query = supabase
    .from('equipment_presets')
    .select(`
      *,
      classes!class_id (
        id,
        name
      )
    `)
    .order('name')

  if (classId) {
    query = query.eq('class_id', parseInt(classId))
  }

  if (isDefault === 'true') {
    query = query.eq('is_default', true)
  }

  const { data: presets, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Formatta la risposta
  const formattedPresets = presets.map(preset => ({
    ...preset,
    class_name: preset.classes?.name
  }))

  return NextResponse.json({ 
    presets: formattedPresets,
    total: formattedPresets.length 
  })
}

// POST /api/equipment/presets - Crea un nuovo preset
export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerSupabase(cookieStore)
  const body: CreateEquipmentPresetDTO = await request.json()

  // Validazione
  if (!body.name || !body.class_id || !body.items) {
    return NextResponse.json(
      { error: 'Nome, class_id e items sono obbligatori' },
      { status: 400 }
    )
  }

  // Se è default, resetta gli altri default per questa classe
  if (body.is_default) {
    await supabase
      .from('equipment_presets')
      .update({ is_default: false })
      .eq('class_id', body.class_id)
  }

  const { data: preset, error } = await supabase
    .from('equipment_presets')
    .insert({
      name: body.name,
      class_id: body.class_id,
      description: body.description || null,
      items: body.items as unknown as import('@/lib/supabase/types').Json,
      choices: (body.choices || []) as unknown as import('@/lib/supabase/types').Json,
      is_default: body.is_default || false
    } as any)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(preset, { status: 201 })
}