// app/api/classes/route.ts
import { makeListRoute } from '@/lib/supabase/server'

export const GET = makeListRoute('classes')
