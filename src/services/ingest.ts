import axios from 'axios'
import type { AlertEvent, Chain, PricePoint } from '../types'
import { summarizeAlert } from './ai'

// NOTE: Replace endpoints with authenticated calls as needed.

export async function fetchPriceSeries(tokenId: string, days = 1): Promise<PricePoint[]> {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}`
    const { data } = await axios.get(url)
    const points: PricePoint[] = (data.prices || []).map((p: [number, number]) => ({ time: p[0], price: p[1] }))
    return points
  } catch (e) {
    return []
  }
}

export async function detectDumpsFromSeries(points: PricePoint[], tokenSymbol: string, chain: Chain): Promise<AlertEvent[]> {
  const events: AlertEvent[] = []
  if (points.length < 5) return events
  for (let i = 4; i < points.length; i++) {
    const window = points.slice(i - 4, i + 1)
    const start = window[0].price
    const end = window[4].price
    const change = ((end - start) / start) * 100
    if (change <= -10) {
      const severity: AlertEvent['severity'] = change <= -20 ? 'High' : change <= -15 ? 'Medium' : 'Low'
      const ev: AlertEvent = {
        id: `${tokenSymbol}-${window[4].time}`,
        timestamp: window[4].time,
        chain,
        tokenSymbol,
        eventType: 'Dump',
        severity,
        priceChangePercent: Math.round(change * 10) / 10,
        summary: summarizeAlert({ eventType: 'Dump', priceChangePercent: Math.round(change * 10) / 10, tokenSymbol, chain }),
        source: 'Coingecko',
      }
      events.push(ev)
    }
  }
  return events
}

// Whale movement stub: in real app, call Etherscan/Solscan/BSCScan and normalize.
export async function fetchWhaleMoves(chain: Chain): Promise<AlertEvent[]> {
  // Placeholder providing an example event
  const now = Date.now()
  const uid = (globalThis.crypto && 'randomUUID' in globalThis.crypto)
    ? // modern browsers
      (globalThis.crypto as any).randomUUID()
    : // fallback
      Math.random().toString(36).slice(2, 10)
  return [
    {
      id: `whale-${chain}-${now}-${uid}`,
      timestamp: now,
      chain,
      tokenSymbol: 'USDT',
      eventType: 'Whale Move',
      severity: 'High',
      amountUSD: 12_000_000,
      wallets: [{ address: '0xABC...123', label: 'Whale Wallet' }],
      exchanges: [{ name: 'Binance' }],
      summary: summarizeAlert({ eventType: 'Whale Move', amountUSD: 12_000_000, tokenSymbol: 'USDT', chain, exchanges: [{ name: 'Binance' }] }),
      source: 'Stub',
    },
  ]
}