// app/api/equipment/presets/[id]/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { UpdateEquipmentPresetDTO } from '@/types/equipment'

// GET /api/equipment/presets/[id] - Singolo preset
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { data: preset, error } = await supabase
    .from('equipment_presets')
    .select(`
      *,
      classes!class_id (
        id,
        name
      )
    `)
    .eq('id', parseInt(id))
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({
    ...preset,
    class_name: preset.classes?.name
  })
}

// PUT /api/equipment/presets/[id] - Aggiorna preset
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)
  const body: UpdateEquipmentPresetDTO = await request.json()

  // Se imposta come default, resetta gli altri
  if (body.is_default) {
    const { data: current } = await supabase
      .from('equipment_presets')
      .select('class_id')
      .eq('id', parseInt(id))
      .single()

  if (current && current.class_id != null) {
      await supabase
        .from('equipment_presets')
        .update({ is_default: false })
        .eq('class_id', current.class_id)
        .neq('id', parseInt(id))
    }
  }

  const { data: preset, error } = await supabase
    .from('equipment_presets')
    .update({
      name: body.name,
      class_id: body.class_id,
      description: body.description,
      items: body.items as unknown as import('@/lib/supabase/types').Json,
      choices: body.choices as unknown as import('@/lib/supabase/types').Json,
      is_default: body.is_default
    })
    .eq('id', parseInt(id))
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(preset)
}

// DELETE /api/equipment/presets/[id] - Elimina preset
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params
  const supabase = createServerSupabase(cookieStore)

  const { error } = await supabase
    .from('equipment_presets')
    .delete()
    .eq('id', parseInt(id))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}