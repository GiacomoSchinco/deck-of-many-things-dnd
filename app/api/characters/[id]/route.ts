// app/api/characters/[id]/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const { id } = await params

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // Ottieni l'utente loggato
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  // Carica personaggio con TUTTI i dettagli
  const { data: character, error } = await supabase
    .from('characters')
    .select(`
      *,
      races:race_id (*),
      classes:class_id (*),
      campaigns:campaign_id (*),
      ability_scores (*),
      combat_stats (*),
      inventory (*),
      features (*),
      spells_known (
        *,
        spells:spell_id (*)
      ),
      spell_slots (*),
      notes (*)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(character)
}