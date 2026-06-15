import { createClient } from '@supabase/supabase-js'

export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type VoteOption =
  | 'With sugar and milk'
  | 'With sugar only'
  | 'With milk only'
  | 'Black'

export const VOTE_OPTIONS: VoteOption[] = [
  'With sugar and milk',
  'With sugar only',
  'With milk only',
  'Black',
]
