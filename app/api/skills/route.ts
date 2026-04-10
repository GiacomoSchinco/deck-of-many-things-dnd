// app/api/skills/route.ts
import { makeListRoute } from '@/lib/supabase/server'

export const GET = makeListRoute('skills')
