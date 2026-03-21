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

    let query = supabase
      .from('inventory')
      .select('*', { count: 'exact' })
      .eq('character_id', id)
      .order('id', { ascending: false })

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
    const newItems = body?.items

    if (!Array.isArray(newItems)) {
      return NextResponse.json({ error: 'items deve essere un array' }, { status: 400 })
    }

    const allowedTypes = ['weapon', 'armor', 'gear', 'magic', 'consumable', 'ammunition', 'tool']

    // 1. Recupera l'inventario esistente
    const { data: existingItems } = await supabase
      .from('inventory')
      .select('item_id, quantity')
      .eq('character_id', id)

    const existingMap = new Map()
    existingItems?.forEach((item: any) => {
      existingMap.set(item.item_id, item.quantity)
    })

    // 2. Raggruppa i nuovi items per item_id (somma quantità)
    const itemsToAdd = new Map()
    for (const item of newItems) {
      let quantity = 1
      if (typeof item.quantity === 'number') {
        quantity = Math.max(1, Math.trunc(item.quantity))
      } else if (typeof item.quantity === 'string' && item.quantity.trim() !== '') {
        quantity = Math.max(1, Math.trunc(Number(item.quantity)))
      }
      
      const itemId = item.item_id
      const current = itemsToAdd.get(itemId) || 0
      itemsToAdd.set(itemId, current + quantity)
    }

    // 3. Prepara le operazioni
    const toInsert = []
    const toUpdate = []

    for (const [itemId, quantityToAdd] of itemsToAdd.entries()) {
      if (existingMap.has(itemId)) {
        // Esiste già → aggiorna quantità
        toUpdate.push({
          item_id: itemId,
          new_quantity: existingMap.get(itemId) + quantityToAdd
        })
      } else {
        // Non esiste → inserisci nuovo
        const itemData = newItems.find(i => i.item_id === itemId)
        
        // Determina item_type
        let itemType = null
        if (typeof itemData?.item_type === 'string' && allowedTypes.includes(itemData.item_type)) {
          itemType = itemData.item_type
        } else if (typeof itemData?.type === 'string' && allowedTypes.includes(itemData.type)) {
          itemType = itemData.type
        }

        // Determina item_name
        let itemName = null
        if (typeof itemData?.item_name === 'string') {
          itemName = itemData.item_name
        } else if (typeof itemData?.name === 'string') {
          itemName = itemData.name
        }

        // Gestisci peso
        let weight = 0
        if (typeof itemData?.weight === 'number') {
          weight = itemData.weight
        } else if (typeof itemData?.weight === 'string' && itemData.weight.trim() !== '') {
          weight = Number(itemData.weight)
        }

        toInsert.push({
          character_id: id,
          item_id: itemId,
          item_name: itemName,
          item_type: itemType,
          quantity: quantityToAdd,
          weight: weight,
          equipped: Boolean(itemData?.equipped),
          description: typeof itemData?.description === 'string' ? itemData.description : null,
          notes: typeof itemData?.notes === 'string' ? itemData.notes : null,
          cost: typeof itemData?.cost === 'number' ? itemData.cost : (typeof itemData?.value === 'number' ? itemData.value : null),
          cost_unit: typeof itemData?.cost_unit === 'string' ? itemData.cost_unit : (typeof itemData?.currency === 'string' ? itemData.currency : 'po'),
          properties: typeof itemData?.properties === 'object' && itemData.properties !== null ? itemData.properties : {},
        })
      }
    }

    // 4. Esegui aggiornamenti (per oggetti esistenti)
    for (const update of toUpdate) {
      await supabase
        .from('inventory')
        .update({ quantity: update.new_quantity })
        .eq('character_id', id)
        .eq('item_id', update.item_id)
    }

    // 5. Inserisci nuovi oggetti
    let inserted = []
    if (toInsert.length > 0) {
      // Filtra righe valide (devono avere almeno item_name)
      const validRows = toInsert.filter(row => row.item_name)
      
      if (validRows.length > 0) {
        const { data, error } = await supabase
          .from('inventory')
          .insert(validRows)
          .select()

        if (error) {
          console.error('Errore POST inventory:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }
        inserted = data || []
      }
    }

    // 6. Recupera inventario aggiornato per la risposta
    const { data: finalInventory } = await supabase
      .from('inventory')
      .select('*')
      .eq('character_id', id)
      .order('id', { ascending: false })

    return NextResponse.json({ 
      inserted: inserted.length, 
      updated: toUpdate.length,
      items: finalInventory 
    })
    
  } catch (error) {
    console.error('Errore inaspettato:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore interno' },
      { status: 500 }
    )
  }
}