import { useState, useEffect } from 'react'
import TradeSide from './TradeSide'
import { DRAFT_PICKS } from '../data/draftPicks'

const POSITION_COLORS = {
  QB: 'bg-red-500',
  RB: 'bg-green-500',
  WR: 'bg-blue-500',
  TE: 'bg-yellow-500',
}

function calcDynastyValue(player) {
  const posBase = { QB: 6000, RB: 5500, WR: 5800, TE: 5000 }
  const base = posBase[player.position] || 4000
  const age = player.age || 26
  const exp = player.years_exp ?? 3

  let value = base
  if (exp === 0) value += 1500
  else if (exp === 1) value += 800
  else if (exp === 2) value += 300

  if (age <= 23) value += 1200
  else if (age <= 25) value += 600
  else if (age <= 27) value += 0
  else if (age <= 29) value -= 600
  else if (age <= 31) value -= 1500
  else value -= 2500

  return Math.max(100, Math.round(value))
}

export default function TradeAnalyzer() {
  const [searchItems, setSearchItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sideA, setSideA] = useState([])
  const [sideB, setSideB] = useState([])

  useEffect(() => {
    fetch('/api/players')
      .then(r => r.json())
      .then(data => {
        const players = data
          .map(p => ({ ...p, type: 'player', value: calcDynastyValue(p) }))
          .sort((a, b) => b.value - a.value)

        // Merge players + draft picks into one searchable list
        setSearchItems([...players, ...DRAFT_PICKS])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load players. Is the server running?')
        setLoading(false)
      })
  }, [])

  const totalA = sideA.reduce((s, p) => s + p.value, 0)
  const totalB = sideB.reduce((s, p) => s + p.value, 0)
  const diff = totalA - totalB
  const winner = diff > 0 ? 'A' : diff < 0 ? 'B' : null

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400 animate-pulse text-lg">Loading players from Sleeper...</div>
    </div>
  )

  if (error) return (
    <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-red-300">
      {error}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Trade verdict */}
      {(sideA.length > 0 || sideB.length > 0) && (
        <div className={`rounded-xl p-4 text-center border ${
          winner === 'A' ? 'bg-green-900/30 border-green-700' :
          winner === 'B' ? 'bg-red-900/30 border-red-700' :
          'bg-gray-800 border-gray-700'
        }`}>
          {winner ? (
            <>
              <p className="text-sm text-gray-400 mb-1">Trade Winner</p>
              <p className={`text-3xl font-bold ${winner === 'A' ? 'text-green-400' : 'text-red-400'}`}>
                Side {winner} wins by {Math.abs(diff).toLocaleString()} pts
              </p>
            </>
          ) : (
            <p className="text-xl font-bold text-gray-300">Even Trade</p>
          )}
        </div>
      )}

      {/* Two sides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TradeSide
          label="Side A"
          items={searchItems}
          selected={sideA}
          setSelected={setSideA}
          total={totalA}
          isWinner={winner === 'A'}
          positionColors={POSITION_COLORS}
        />
        <TradeSide
          label="Side B"
          items={searchItems}
          selected={sideB}
          setSelected={setSideB}
          total={totalB}
          isWinner={winner === 'B'}
          positionColors={POSITION_COLORS}
        />
      </div>
    </div>
  )
}
