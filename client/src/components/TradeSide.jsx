import { useState } from 'react'

const ESPN_HEADSHOT = (espnId) =>
  `https://a.espncdn.com/i/headshots/nfl/players/full/${espnId}.png`

const PICK_ROUND_COLORS = {
  1: 'bg-yellow-500',
  2: 'bg-gray-400',
  3: 'bg-orange-700',
  4: 'bg-gray-600',
}

function PlayerPhoto({ item }) {
  const [imgError, setImgError] = useState(false)

  if (item.type === 'pick') {
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${PICK_ROUND_COLORS[item.round] || 'bg-gray-600'}`}>
        R{item.round}
      </div>
    )
  }

  if (item.espn_id && !imgError) {
    return (
      <img
        src={ESPN_HEADSHOT(item.espn_id)}
        alt={item.name}
        className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0 bg-gray-700"
        onError={() => setImgError(true)}
      />
    )
  }

  // Fallback initials avatar
  const initials = item.name.split(' ').map(n => n[0]).slice(0, 2).join('')
  return (
    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-xs font-bold flex-shrink-0">
      {initials}
    </div>
  )
}

function SearchResultRow({ item, positionColors, onSelect }) {
  const [imgError, setImgError] = useState(false)

  return (
    <li
      onMouseDown={() => onSelect(item)}
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer"
    >
      {/* Mini photo in dropdown */}
      {item.type === 'pick' ? (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${PICK_ROUND_COLORS[item.round] || 'bg-gray-600'}`}>
          R{item.round}
        </div>
      ) : item.espn_id && !imgError ? (
        <img
          src={ESPN_HEADSHOT(item.espn_id)}
          alt={item.name}
          className="w-7 h-7 rounded-full object-cover object-top flex-shrink-0 bg-gray-700"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
          {item.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
        </div>
      )}

      {item.type === 'pick' ? (
        <>
          <span className="flex-1 text-white text-sm">{item.name}</span>
          <span className="text-indigo-300 text-xs font-semibold">{item.value.toLocaleString()}</span>
        </>
      ) : (
        <>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${positionColors[item.position]} text-white`}>
            {item.position}
          </span>
          <span className="flex-1 text-white text-sm">{item.name}</span>
          <span className="text-gray-400 text-xs">{item.team}</span>
          <span className="text-indigo-300 text-xs font-semibold">{item.value.toLocaleString()}</span>
        </>
      )}
    </li>
  )
}

export default function TradeSide({ label, items, selected, setSelected, total, isWinner, positionColors }) {
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const filtered = query.length > 1
    ? items
        .filter(p => !selected.find(s => s.id === p.id))
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 12)
    : []

  function addItem(item) {
    setSelected(prev => [...prev, item])
    setQuery('')
    setShowDropdown(false)
  }

  function removeItem(id) {
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

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setShowDropdown(true) }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          placeholder="Search player or pick (e.g. Mahomes, 2025 1st)..."
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />
        {showDropdown && filtered.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-72 overflow-y-auto">
            {filtered.map(item => (
              <SearchResultRow
                key={item.id}
                item={item}
                positionColors={positionColors}
                onSelect={addItem}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Selected items */}
      <div className="space-y-2 min-h-[80px]">
        {selected.length === 0 && (
          <p className="text-gray-600 text-sm italic">Add players or picks...</p>
        )}
        {selected.map(item => (
          <div key={item.id} className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2">
            <PlayerPhoto item={item} />

            {item.type === 'pick' ? (
              <>
                <span className="flex-1 text-white text-sm font-medium">{item.name}</span>
              </>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.name}</p>
                  <p className="text-gray-400 text-xs">{item.team} · {item.position}{item.age ? ` · Age ${item.age}` : ''}</p>
                </div>
              </>
            )}

            <span className="text-indigo-300 text-xs font-semibold whitespace-nowrap">{item.value.toLocaleString()}</span>
            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-500 hover:text-red-400 text-lg leading-none ml-1 flex-shrink-0"
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
