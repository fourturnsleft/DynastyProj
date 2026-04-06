import { useState } from 'react'

export default function TradeSide({ label, players, selected, setSelected, total, isWinner, positionColors }) {
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const filtered = query.length > 1
    ? players
        .filter(p => !selected.find(s => s.id === p.id))
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10)
    : []

  function addPlayer(player) {
    setSelected(prev => [...prev, player])
    setQuery('')
    setShowDropdown(false)
  }

  function removePlayer(id) {
    setSelected(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className={`bg-gray-900 rounded-xl border ${isWinner ? 'border-green-600' : 'border-gray-700'} p-5 space-y-4`}>
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-bold ${isWinner ? 'text-green-400' : 'text-white'}`}>
          {label} {isWinner && '🏆'}
        </h2>
        <span className="text-indigo-400 font-semibold text-sm">
          {total.toLocaleString()} pts
        </span>
      </div>

      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setShowDropdown(true) }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          placeholder="Search player..."
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />
        {showDropdown && filtered.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {filtered.map(p => (
              <li
                key={p.id}
                onMouseDown={() => addPlayer(p)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm"
              >
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${positionColors[p.position]} text-white`}>
                  {p.position}
                </span>
                <span className="flex-1 text-white">{p.name}</span>
                <span className="text-gray-400 text-xs">{p.team}</span>
                <span className="text-indigo-300 text-xs font-semibold">{p.value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected players */}
      <div className="space-y-2 min-h-[80px]">
        {selected.length === 0 && (
          <p className="text-gray-600 text-sm italic">No players added yet</p>
        )}
        {selected.map(p => (
          <div key={p.id} className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2">
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${positionColors[p.position]} text-white`}>
              {p.position}
            </span>
            <span className="flex-1 text-white text-sm font-medium">{p.name}</span>
            <span className="text-gray-400 text-xs">{p.team}</span>
            <span className="text-indigo-300 text-xs font-semibold">{p.value.toLocaleString()}</span>
            <button
              onClick={() => removePlayer(p.id)}
              className="text-gray-500 hover:text-red-400 text-lg leading-none ml-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <button
          onClick={() => setSelected([])}
          className="text-xs text-gray-500 hover:text-red-400 underline"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
