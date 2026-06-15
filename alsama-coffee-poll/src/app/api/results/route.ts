import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { VOTE_OPTIONS } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const { data, error } = await supabase.from('votes').select('option')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const counts: Record<string, number> = {}
  VOTE_OPTIONS.forEach((o) => (counts[o] = 0))
  data?.forEach(({ option }) => {
    if (option in counts) counts[option]++
  })

  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const results = VOTE_OPTIONS.map((option) => ({
    option,
    count: counts[option],
    percentage: total === 0 ? 0 : Math.round((counts[option] / total) * 100),
  }))

  return NextResponse.json({ results, total })
}
