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

    // Detect whether the inventory table uses the legacy `item_name`/`item_type` columns
    // or the simplified `name`/`type` columns. We try `name` first and fall back.
    let nameCol = 'name'
    let typeCol = 'type'
    try {
      const test = await supabase.from('inventory').select('name').limit(1).maybeSingle()
      if (test.error) {
        nameCol = 'item_name'
      }
    } catch (e) {
      nameCol = 'item_name'
    }

    try {
      const test2 = await supabase.from('inventory').select('type').limit(1).maybeSingle()
      if (test2.error) {
        typeCol = 'item_type'
      }
    } catch (e) {
      typeCol = 'item_type'
    }

    let query = supabase
      .from('inventory')
      .select('*', { count: 'exact' })
      .eq('character_id', id)
      .order('id', { ascending: false })

    if (equipped === 'true' || equipped === 'false') {
      query = query.eq('equipped', equipped === 'true')
    }

    if (itemType) {
      query = query.eq(typeCol, itemType)
    }

    if (search && search.trim()) {
      const like = `%${search}%`
      query = query.or(`${nameCol}.ilike.${like},description.ilike.${like}`)
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

    // Accept item identifiers in several shapes: { item_id }, { itemId }, { id }, numeric strings
    const validShape = Array.isArray(newItems) && newItems.every((i) => {
      const rawId = i?.item_id ?? i?.itemId ?? i?.id
      return typeof rawId === 'number' || (typeof rawId === 'string' && /^\d+$/.test(rawId))
    })

    if (!validShape) {
      return NextResponse.json({ error: 'items deve essere un array di { item_id|itemId|id, quantity }' }, { status: 400 })
    }

    // 1. Aggrega quantità per item_id (gestisce duplicati nel payload)
    const qtyMap = new Map<number, number>()
    for (const item of newItems) {
      const rawId = item?.item_id ?? item?.itemId ?? item?.id
      const itemId = typeof rawId === 'string' ? Number(rawId) : rawId
      const qty = Math.max(1, Math.trunc(Number(item.quantity) || 1))
      qtyMap.set(itemId, (qtyMap.get(itemId) ?? 0) + qty)
    }

    const itemIds = [...qtyMap.keys()]

    // 2. Fetch dati completi dal catalogo items
    const { data: catalogItems, error: catalogError } = await supabase
      .from('items')
      .select('id, name, type, weight, value, currency, description, properties')
      .in('id', itemIds)

    if (catalogError) {
      return NextResponse.json({ error: catalogError.message }, { status: 500 })
    }

    const catalogMap = new Map((catalogItems ?? []).map((i) => [i.id as number, i]))

    // 3. Recupera inventario esistente per gestire duplicati
    const { data: existingItems } = await supabase
      .from('inventory')
      .select('item_id, quantity')
      .eq('character_id', id)
      .in('item_id', itemIds)

    const existingMap = new Map((existingItems ?? []).map((i) => [i.item_id as number, i.quantity as number]))

    // 4. Prepara insert / update
    const toInsert = []
    const toUpdate = []

    // Detect inventory column names once for the POST flow
    let nameCol = 'name'
    let typeCol = 'type'
    let valueCol = 'value'
    try {
      const tn = await supabase.from('inventory').select('name').limit(1).maybeSingle()
      if (tn.error) nameCol = 'item_name'
    } catch (e) {
      nameCol = 'item_name'
    }
    try {
      const tt = await supabase.from('inventory').select('type').limit(1).maybeSingle()
      if (tt.error) typeCol = 'item_type'
    } catch (e) {
      typeCol = 'item_type'
    }
    try {
      const tv = await supabase.from('inventory').select('value').limit(1).maybeSingle()
      if (tv.error) valueCol = 'cost'
    } catch (e) {
      valueCol = 'cost'
    }

    for (const [itemId, quantityToAdd] of qtyMap.entries()) {
      const cat = catalogMap.get(itemId)
      if (!cat) continue // item_id non trovato nel catalogo — skip

      if (existingMap.has(itemId)) {
        toUpdate.push({ item_id: itemId, new_quantity: existingMap.get(itemId)! + quantityToAdd })
      } else {
        const props = cat.properties as Record<string, unknown> | null
        const itemType = (props?.itemType as string | undefined) ?? (cat.type as string) ?? 'gear'
        const row: Record<string, unknown> = {
          character_id: id,
          item_id: itemId,
          quantity: quantityToAdd,
          weight: cat.weight ?? 0,
          equipped: false,
          description: cat.description ?? null,
          notes: null,
          properties: props ?? {},
        }

        // Assign detected keys (nameCol/typeCol/valueCol detected once above)
        ;(row as any)[nameCol] = cat.name
        ;(row as any)[typeCol] = itemType
        ;(row as any)[valueCol] = cat.value ?? null

        toInsert.push(row)
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
      // Filtra righe valide (devono avere almeno il nome nella colonna rilevata)
      const validRows = toInsert.filter(row => Boolean((row as any)[nameCol]))

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