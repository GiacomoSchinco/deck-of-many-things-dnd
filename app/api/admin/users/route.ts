// app/api/admin/users/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

// Helper per verificare se l'utente è admin
async function isAdmin(supabase: SupabaseClient<Database>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role === 'admin';
}

// GET /api/admin/users - Lista tutti gli utenti (solo profili)
export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerSupabase(cookieStore);

  // Verifica autenticazione
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  // Verifica ruolo admin
  const admin = await isAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: 'Accesso negato. Solo admin.' }, { status: 403 });
  }

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, username, role, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((profiles as Profile[]) ?? []);
}
