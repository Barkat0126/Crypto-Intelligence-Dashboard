import type { AlertEvent } from '../types'

// Simple heuristic summarizer stub; replace with real LLM when available.
export function summarizeAlert(event: Partial<AlertEvent>): string {
  const parts: string[] = []
  if (event.eventType === 'Whale Move') {
    parts.push('Large wallet activity detected')
    if (event.amountUSD) parts.push(`~$${Math.round(event.amountUSD).toLocaleString()}`)
    if (event.tokenSymbol) parts.push(`in ${event.tokenSymbol}`)
    if (event.exchanges?.length) parts.push(`towards ${event.exchanges.map(e => e.name).join(', ')}`)
  } else if (event.eventType === 'Dump') {
    parts.push('Sudden price drop')
    if (event.priceChangePercent) parts.push(`${event.priceChangePercent}%`) 
    if (event.tokenSymbol) parts.push(`on ${event.tokenSymbol}`)
  }
  if (event.chain) parts.push(`[${event.chain}]`)
  return parts.join(' ').trim() || 'New market alert'
}