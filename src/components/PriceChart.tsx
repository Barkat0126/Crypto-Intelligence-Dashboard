import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts'
import type { PricePoint, AlertEvent } from '../types'

interface Props {
  data: PricePoint[]
  dumps?: AlertEvent[]
}

export default function PriceChart({ data, dumps = [] }: Props) {
  const formatted = data.map((p) => ({ time: new Date(p.time).toLocaleTimeString(), price: p.price }))
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={formatted} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <XAxis dataKey="time" hide={false} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#2563eb" dot={false} strokeWidth={2} />
          {dumps.map((d) => (
            <ReferenceDot key={d.id} x={new Date(d.timestamp).toLocaleTimeString()} y={formatted.find(f => f.time === new Date(d.timestamp).toLocaleTimeString())?.price} r={5} fill="#ef4444" stroke="#ef4444" />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}