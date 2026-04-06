import TradeAnalyzer from './components/TradeAnalyzer'
import './index.css'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-indigo-400 tracking-wide">Dynasty Trade Analyzer</h1>
        <p className="text-gray-400 text-sm mt-1">Powered by Sleeper · Rookie-focused dynasty values</p>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <TradeAnalyzer />
      </main>
    </div>
  )
}
