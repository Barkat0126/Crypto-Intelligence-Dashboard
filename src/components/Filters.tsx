import { useMemo } from 'react'
import type { Chain, EventType, Severity, Filters } from '../types'

const CHAINS: Chain[] = ['ETH', 'SOL', 'BSC']
const EVENT_TYPES: EventType[] = ['Whale Move', 'Dump']
const SEVERITIES: Severity[] = ['High', 'Medium', 'Low']

interface Props {
  filters: Filters
  onChange: (next: Filters) => void
}

export default function Filters({ filters, onChange }: Props) {
  const chip = (active: boolean) => ({
    padding: '8px 12px',
    borderRadius: 16,
    border: '1px solid ' + (active ? '#93c5fd' : '#e5e7eb'),
    cursor: 'pointer',
    background: active ? '#eef2ff' : '#ffffff',
    color: active ? '#1e3a8a' : '#0f172a',
    boxShadow: active ? '0 4px 12px rgba(30,58,138,0.10)' : '0 2px 8px rgba(2,6,23,0.05)',
    marginRight: 8,
    outline: 'none'
  } as const)

  const setChain = (c: Chain) => {
    const next = filters.chains.includes(c)
      ? filters.chains.filter((x) => x !== c)
      : [...filters.chains, c]
    onChange({ ...filters, chains: next })
  }
  const setEvent = (e: EventType) => {
    const next = filters.eventTypes.includes(e)
      ? filters.eventTypes.filter((x) => x !== e)
      : [...filters.eventTypes, e]
    onChange({ ...filters, eventTypes: next })
  }
  const setSeverity = (s: Severity) => {
    const next = filters.severities.includes(s)
      ? filters.severities.filter((x) => x !== s)
      : [...filters.severities, s]
    onChange({ ...filters, severities: next })
  }

  const placeholder = useMemo(() => 'Search token or contract…', [])

  return (
    <div style={{ display: 'grid', gap: 12, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <strong style={{ minWidth: 90, color: '#334155', marginBottom: 6 }}>Chain:</strong>
        {CHAINS.map((c) => {
          const active = filters.chains.includes(c)
          return (
            <span
              key={c}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              onClick={() => setChain(c)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setChain(c) }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(2,6,23,0.08)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = active ? '0 4px 12px rgba(30,58,138,0.10)' : '0 2px 8px rgba(2,6,23,0.05)' }}
              style={chip(active)}
            >
              {c}
            </span>
          )
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <strong style={{ minWidth: 90, color: '#334155', marginBottom: 6 }}>Event:</strong>
        {EVENT_TYPES.map((e) => {
          const active = filters.eventTypes.includes(e)
          return (
            <span
              key={e}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              onClick={() => setEvent(e)}
              onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') setEvent(e) }}
              onMouseEnter={(ev) => { (ev.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(2,6,23,0.08)' }}
              onMouseLeave={(ev) => { (ev.currentTarget as HTMLElement).style.boxShadow = active ? '0 4px 12px rgba(30,58,138,0.10)' : '0 2px 8px rgba(2,6,23,0.05)' }}
              style={chip(active)}
            >
              {e}
            </span>
          )
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <strong style={{ minWidth: 90, color: '#334155', marginBottom: 6 }}>Severity:</strong>
        {SEVERITIES.map((s) => {
          const active = filters.severities.includes(s)
          return (
            <span
              key={s}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              onClick={() => setSeverity(s)}
              onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') setSeverity(s) }}
              onMouseEnter={(ev) => { (ev.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(2,6,23,0.08)' }}
              onMouseLeave={(ev) => { (ev.currentTarget as HTMLElement).style.boxShadow = active ? '0 4px 12px rgba(30,58,138,0.10)' : '0 2px 8px rgba(2,6,23,0.05)' }}
              style={chip(active)}
            >
              {s}
            </span>
          )
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 18 }}>🔍</span>
        <input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder={placeholder}
          style={{ flex: 1, minWidth: 220, padding: '10px 12px', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(2,6,23,0.06)' }}
        />
      </div>
    </div>
  )
}