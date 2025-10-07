import type { AlertEvent } from '../types'

interface Props {
  event: AlertEvent
  onSelect?: (event: AlertEvent) => void
}

export default function AlertCard({ event, onSelect }: Props) {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 14,
    cursor: 'pointer',
    background: '#ffffff',
    boxShadow: '0 6px 16px rgba(16,24,40,0.06)',
    transition: 'box-shadow 160ms ease',
  }
  const headStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }
  const badgeStyle: React.CSSProperties = { fontSize: 12, padding: '4px 8px', borderRadius: 24, border: '1px solid #ddd' }
  const sevStyle = (sev: AlertEvent['severity']): React.CSSProperties => ({
    ...badgeStyle,
    background: sev === 'High' ? '#fee2e2' : sev === 'Medium' ? '#fef3c7' : '#dcfce7',
    borderColor: sev === 'High' ? '#fecaca' : sev === 'Medium' ? '#fde68a' : '#bbf7d0',
  })
  const tokenStyle: React.CSSProperties = { marginLeft: 'auto', fontWeight: 600 }
  const timeStyle: React.CSSProperties = { color: '#666' }
  const summaryStyle: React.CSSProperties = { marginTop: 8, color: '#222' }
  const metaStyle: React.CSSProperties = { marginTop: 6, display: 'flex', gap: 12, color: '#555', fontSize: 13, flexWrap: 'wrap' }

  const leftAccent = (sev: AlertEvent['severity']) => sev === 'High' ? '#ef4444' : sev === 'Medium' ? '#f59e0b' : '#10b981'

  return (
    <div
      style={{ ...cardStyle, borderLeft: `3px solid ${leftAccent(event.severity)}` }}
      onClick={() => onSelect?.(event)}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(16,24,40,0.10)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(16,24,40,0.06)' }}
    >
      <div style={headStyle}>
        <span style={{ ...badgeStyle, background: '#f8fafc' }}>{event.chain}</span>
        <span style={{ ...badgeStyle, background: '#f0fdf4' }}>{event.eventType}</span>
        <span style={sevStyle(event.severity)}>{event.severity}</span>
        <span style={tokenStyle}>{event.tokenSymbol}</span>
        <span style={timeStyle}>{new Date(event.timestamp).toLocaleString('en-CA', { hour12: false })}</span>
      </div>
      <div style={summaryStyle}>{event.summary}</div>
      <div style={metaStyle}>
        {event.amountUSD && (
          <span>
            {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.round(event.amountUSD))}
          </span>
        )}
        {event.priceChangePercent && <span>{event.priceChangePercent}%</span>}
        {event.wallets?.length && (
          <span>Wallets: {event.wallets.map((w) => w.label || w.address).join(', ')}</span>
        )}
        {event.exchanges?.length && (
          <span>Exchanges: {event.exchanges.map((e) => e.name).join(', ')}</span>
        )}
      </div>
    </div>
  )
}