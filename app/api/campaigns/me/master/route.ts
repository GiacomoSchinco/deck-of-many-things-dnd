// app/api/campaigns/me/master/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerSupabase(cookieStore);

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  // Campagne dove l'utente è master (dungeon_master_id)
  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      dungeon_master:profiles!dungeon_master_id (id, username),
      members:campaign_members (
        user_id,
        role,
        profile:profiles!campaign_members_user_id_fkey (id, username)
      ),
      characters:characters (id, name, level, user_id)
    `)
    .eq('dungeon_master_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(campaigns);
}