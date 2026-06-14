interface Props {
  label: string
  value: string
  accent?: boolean
}

export default function StatisticsCard({ label, value, accent }: Props) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#151515', border: '1px solid #1E1E1E' }}
    >
      <div
        className="text-lg font-bold mb-1"
        style={{ color: accent ? '#00D4AA' : '#fff' }}
      >
        {value}
      </div>
      <div className="text-xs leading-tight" style={{ color: '#A0A0A0' }}>
        {label}
      </div>
    </div>
  )
}
