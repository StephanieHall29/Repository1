import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, VOTE_OPTIONS, VoteOption } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { option } = await req.json()

  if (!VOTE_OPTIONS.includes(option as VoteOption)) {
    return NextResponse.json({ error: 'Invalid option' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { error } = await supabase.from('votes').insert({ option })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
