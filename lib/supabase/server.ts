import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import type { Database } from './types'
import type { SupabaseClient } from '@supabase/supabase-js'

type TableName = keyof Database['public']['Tables']

export function createServerSupabase(cookieStore: ReadonlyRequestCookies) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) => {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )
}

/**
 * Verifica l'autenticazione sull'istanza Supabase fornita.
 * Restituisce `{ user }` se autenticato, o `{ error: NextResponse }` con 401 se no.
 */
export async function requireAuth(supabase: SupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { user: null, error: NextResponse.json({ error: 'Non autorizzato' }, { status: 401 }) }
  }
  return { user, error: null }
}

/**
 * Verifica che l'utente autenticato abbia ruolo 'admin'.
 * Restituisce `{ user }` se admin, o `{ error: NextResponse }` con 401/403 se no.
 */
export async function requireAdmin(supabase: SupabaseClient<Database>) {
  const { user, error: authError } = await requireAuth(supabase)
  if (authError) return { user: null, error: authError }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  if (profile?.role !== 'admin') {
    return {
      user: null,
      error: NextResponse.json({ error: 'Accesso negato. Solo admin.' }, { status: 403 }),
    }
  }
  return { user, error: null }
}

/**
 * Genera un handler GET che restituisce tutti i record di una tabella ordinati per nome.
 * Usato per le route semplici: /api/classes, /api/races, /api/skills
 */
export function makeListRoute(table: TableName) {
  return async function GET() {
    const cookieStore = await cookies()
    const supabase = createServerSupabase(cookieStore)
    const { data, error } = await supabase.from(table).select('*').order('name')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }
}
