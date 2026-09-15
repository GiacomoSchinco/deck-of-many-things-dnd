// app/api/races/route.ts
import { makeListRoute } from '@/lib/supabase/server'

export const GET = makeListRoute('races')
