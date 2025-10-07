import { useEffect, useMemo, useState } from 'react'
import Filters from '../components/Filters'
import AlertCard from '../components/AlertCard'
import PriceChart from '../components/PriceChart'
import { SAMPLE_ALERTS } from '../sampleData'
import type { AlertEvent, Filters as FilterState, Chain } from '../types'
import { initFirebase, loadAlerts } from '../services/firebase'
import { fetchPriceSeries, detectDumpsFromSeries, fetchWhaleMoves } from '../services/ingest'

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>({
    chains: ['ETH', 'SOL', 'BSC'],
    eventTypes: ['Whale Move', 'Dump'],
    severities: ['High', 'Medium', 'Low'],
    search: '',
  })
  const [events, setEvents] = useState<AlertEvent[]>(SAMPLE_ALERTS)
  const [selectedToken, setSelectedToken] = useState<string>('PEPE')
  const [chartPoints, setChartPoints] = useState<{ token: string; points: any[] }>({ token: 'PEPE', points: [] })
  const [chartDumps, setChartDumps] = useState<AlertEvent[]>([])
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 900 : false)
    
  useEffect(() => {
    initFirebase()
    ;(async () => {
      const cloud = await loadAlerts()
      if (cloud && cloud.length) setEvents((prev) => uniqueById([...cloud, ...prev]))
      // Also add a stub whale move for each chain
      const whales = await Promise.all(['ETH', 'SOL', 'BSC'].map((c) => fetchWhaleMoves(c as Chain)))
      setEvents((prev) => uniqueById([...whales.flat(), ...prev]))
    })()
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    ;(async () => {
      const tokenId = tokenToCoingeckoId(selectedToken)
      if (!tokenId) return
      const series = await fetchPriceSeries(tokenId, 1)
      setChartPoints({ token: selectedToken, points: series })
      const dumps = await detectDumpsFromSeries(series, selectedToken, 'ETH')
      setChartDumps(dumps)
    })()
  }, [selectedToken])

  const filtered = useMemo(() => {
    const s = filters.search.trim().toLowerCase()
    return uniqueById(events).filter((e) =>
      filters.chains.includes(e.chain) &&
      filters.eventTypes.includes(e.eventType) &&
      filters.severities.includes(e.severity) &&
      (!s || e.tokenSymbol.toLowerCase().includes(s) || e.tokenContract?.toLowerCase().includes(s))
    ).sort((a, b) => b.timestamp - a.timestamp)
  }, [events, filters])

  const cardContainer: React.CSSProperties = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, boxShadow: '0 6px 16px rgba(16,24,40,0.06)' }
  const headerBar: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, color: '#334155', flexWrap: 'wrap' }
  const subText: React.CSSProperties = { fontSize: 12, color: '#64748b' }
  return (
    <div>
      <div style={headerBar}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>Enterprise Dashboard</h1>
          <div style={subText}>As of {new Date().toLocaleString('en-CA', { hour12: false })}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: isMobile ? 12 : 16 }}>
      <div style={cardContainer}>
        <h2 style={{ marginTop: 0 }}>Real-time Alerts</h2>
        <Filters filters={filters} onChange={setFilters} />
        <div style={{ display: 'grid', gap: 10 }}>
          {filtered.map((e) => (
            <AlertCard key={e.id} event={e} onSelect={(ev) => setSelectedToken(ev.tokenSymbol)} />
          ))}
          {filtered.length === 0 && <div style={{ color: '#666' }}>No alerts match your filters.</div>}
        </div>
      </div>
      <div style={cardContainer}>
        <h2 style={{ marginTop: 0 }}>{selectedToken} — Price & Dump Markers</h2>
        <PriceChart data={chartPoints.points} dumps={chartDumps} />
        <div style={{ marginTop: 8, color: '#666', fontSize: 13 }}>Select an alert to change the chart token.</div>
      </div>
      </div>
    </div>
  )
}

function uniqueById<T extends { id: string }>(arr: T[]): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const item of arr) {
    if (!seen.has(item.id)) {
      seen.add(item.id)
      out.push(item)
    }
  }
  return out
}

function tokenToCoingeckoId(symbol: string): string | null {
  const map: Record<string, string> = {
    BTC: 'bitcoin', ETH: 'ethereum', BNB: 'binancecoin', SOL: 'solana', PEPE: 'pepe', BONK: 'bonk', USDT: 'tether'
  }
  return map[symbol.toUpperCase()] || null
}