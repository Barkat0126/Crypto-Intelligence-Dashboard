export type Chain = 'ETH' | 'SOL' | 'BSC'
export type EventType = 'Whale Move' | 'Dump'
export type Severity = 'High' | 'Medium' | 'Low'

export interface AlertEvent {
  id: string
  timestamp: number
  chain: Chain
  tokenSymbol: string
  tokenContract?: string
  eventType: EventType
  severity: Severity
  amountUSD?: number
  priceChangePercent?: number
  wallets?: { address: string; label?: string }[]
  exchanges?: { name: string }[]
  summary: string
  source: string
}

export interface PricePoint {
  time: number
  price: number
}

export interface Filters {
  chains: Chain[]
  eventTypes: EventType[]
  severities: Severity[]
  search: string
}