import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { VOTE_OPTIONS, VoteOption } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { option } = await req.json()

  if (!VOTE_OPTIONS.includes(option as VoteOption)) {
    return NextResponse.json({ error: 'Invalid option' }, { status: 400 })
  }

  const { error } = await supabase.from('votes').insert({ option })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
