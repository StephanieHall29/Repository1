'use client'

import { useState, useEffect, useCallback } from 'react'
import { VOTE_OPTIONS, VoteOption } from '@/lib/supabase'

type Result = {
  option: string
  count: number
  percentage: number
}

const OPTION_ICONS: Record<string, string> = {
  'With sugar and milk': '☕',
  'With sugar only': '🍬',
  'With milk only': '🥛',
  'Black': '⬛',
}

export default function CoffeePoll() {
  const [selected, setSelected] = useState<VoteOption | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<Result[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch('/api/results')
      const data = await res.json()
      if (data.results) {
        setResults(data.results)
        setTotal(data.total)
      }
    } catch {
      // silent — will retry on next interval
    }
  }, [])

  useEffect(() => {
    if (!submitted) return
    fetchResults()
    const interval = setInterval(fetchResults, 4000)
    return () => clearInterval(interval)
  }, [submitted, fetchResults])

  const handleSubmit = async () => {
    if (!selected) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option: selected }),
      })
      if (!res.ok) throw new Error('Vote failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-4 py-12">
      <header className="mb-10 text-center">
        <span className="alsama-wordmark text-5xl text-pink-700 tracking-wide select-none">
          Alsama
        </span>
        <div className="mt-1 h-px w-16 bg-pink-300 mx-auto" />
      </header>

      <div className="w-full max-w-md">
        {!submitted ? (
          <>
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2 font-display">
              How do you like your coffee?
            </h1>
            <p className="text-center text-sm text-gray-400 mb-8">
              Pick your preference and cast your vote.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {VOTE_OPTIONS.map((option) => {
                const isSelected = selected === option
                return (
                  <button
                    key={option}
                    onClick={() => setSelected(option)}
                    className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl border-2 text-left transition-all duration-150 cursor-pointer
                      ${isSelected
                        ? 'border-pink-500 bg-pink-50 shadow-sm shadow-pink-100'
                        : 'border-pink-200 bg-white hover:border-pink-400 hover:bg-pink-50/50'
                      }`}
                  >
                    <span className="text-2xl">{OPTION_ICONS[option]}</span>
                    <span className={`font-medium text-base ${isSelected ? 'text-pink-700' : 'text-gray-700'}`}>
                      {option}
                    </span>
                    {isSelected && (
                      <span className="ml-auto w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {error && (
              <p className="text-center text-sm text-red-500 mb-4">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!selected || loading}
              className="w-full py-4 rounded-2xl bg-pink-600 text-white font-semibold text-base
                hover:bg-pink-700 active:scale-[0.98] transition-all duration-150
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting…' : 'Submit Vote'}
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-1 font-display">
              Results
            </h1>
            <p className="text-center text-sm text-gray-400 mb-8">
              {total} {total === 1 ? 'vote' : 'votes'} cast · updates every 4 seconds
            </p>

            <div className="flex flex-col gap-4">
              {results.map((r) => (
                <div key={r.option} className="w-full">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <span>{OPTION_ICONS[r.option]}</span>
                      {r.option}
                    </span>
                    <span className="text-sm font-semibold text-pink-600">{r.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-pink-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${r.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {r.count} {r.count === 1 ? 'vote' : 'votes'}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-gray-300 mt-10">Thanks for voting! ☕</p>
          </>
        )}
      </div>
    </main>
  )
}
