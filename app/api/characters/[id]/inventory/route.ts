// app/api/characters/[id]/inventory/route.ts
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
    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search')
    const equipped = searchParams.get('equipped')
    const itemType = searchParams.get('item_type')
    const page = Number(searchParams.get('page') ?? '1')
    const pageSize = Number(searchParams.get('pageSize') ?? '50')

    // Costruisci la query base
    let query = supabase
      .from('inventory')
      .select('*', { count: 'exact' })
      .eq('character_id', id)
      .order('id', { ascending: false })

    // Applica filtri
    if (equipped === 'true' || equipped === 'false') {
      query = query.eq('equipped', equipped === 'true')
    }

    if (itemType) {
      query = query.eq('item_type', itemType)
    }

    if (search && search.trim()) {
      const like = `%${search}%`
      query = query.or(`item_name.ilike.${like},description.ilike.${like}`)
    }

    // Paginazione
    const from = (Math.max(1, page) - 1) * pageSize
    const to = from + pageSize - 1
    const { data, count, error } = await query.range(from, to)
    
    if (error) {
      console.error('Errore GET inventory:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ items: data || [], count: count || 0 })
    
  } catch (error) {
    console.error('Errore inaspettato:', error)
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

    // Verifica che il personaggio esista e appartenga all'utente
    const { data: character, error: charError } = await supabase
      .from('characters')
      .select('user_id')
      .eq('id', id)
      .single()

    if (charError) {
      return NextResponse.json({ error: 'Personaggio non trovato' }, { status: 404 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (character.user_id !== user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const body = await request.json()
    const items = body?.items

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'items deve essere un array' }, { status: 400 })
    }

    const allowedTypes = ['weapon', 'armor', 'gear', 'magic', 'consumable', 'ammunition', 'tool']

    const rows = items.map((item: any) => {
      // Gestisci quantità
      let quantity = 1
      if (typeof item.quantity === 'number') {
        quantity = Math.max(1, Math.trunc(item.quantity))
      } else if (typeof item.quantity === 'string' && item.quantity.trim() !== '') {
        quantity = Math.max(1, Math.trunc(Number(item.quantity)))
      }

      // Gestisci peso
      let weight = 0
      if (typeof item.weight === 'number') {
        weight = item.weight
      } else if (typeof item.weight === 'string' && item.weight.trim() !== '') {
        weight = Number(item.weight)
      }

      // Determina item_type (usa item_type o fallback a type)
      let itemType = null
      if (typeof item.item_type === 'string' && allowedTypes.includes(item.item_type)) {
        itemType = item.item_type
      } else if (typeof item.type === 'string' && allowedTypes.includes(item.type)) {
        itemType = item.type
      }

      // Determina item_id
      let itemId = null
      if (typeof item.item_id === 'number') {
        itemId = item.item_id
      } else if (typeof item.item_id === 'string' && item.item_id.trim() !== '') {
        itemId = Number(item.item_id)
      }

      // Determina item_name
      let itemName = null
      if (typeof item.item_name === 'string') {
        itemName = item.item_name
      } else if (typeof item.name === 'string') {
        itemName = item.name
      }

      return {
        character_id: id,
        item_id: itemId,
        item_name: itemName,
        item_type: itemType,
        quantity: quantity,
        weight: weight,
        equipped: Boolean(item.equipped),
        description: typeof item.description === 'string' ? item.description : null,
        notes: typeof item.notes === 'string' ? item.notes : null,
        cost: typeof item.cost === 'number' ? item.cost : (typeof item.value === 'number' ? item.value : null),
        cost_unit: typeof item.cost_unit === 'string' ? item.cost_unit : (typeof item.currency === 'string' ? item.currency : 'po'),
        properties: typeof item.properties === 'object' && item.properties !== null ? item.properties : {},
      }
    })

    // Filtra righe valide (devono avere almeno item_name)
    const validRows = rows.filter(row => row.item_name)

    if (validRows.length === 0) {
      return NextResponse.json({ error: 'Nessun oggetto valido da inserire' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('inventory')
      .insert(validRows)
      .select()

    if (error) {
      console.error('Errore POST inventory:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ inserted: data?.length || 0, items: data })
    
  } catch (error) {
    console.error('Errore inaspettato:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore interno' },
      { status: 500 }
    )
  }
}