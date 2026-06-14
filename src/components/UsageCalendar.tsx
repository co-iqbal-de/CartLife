interface Props {
  data: Record<string, number>
}

export default function UsageCalendar({ data }: Props) {
  const entries = Object.entries(data)
  const maxVal = Math.max(...Object.values(data), 1)

  function fmtDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="mx-4 mb-4">
      <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#A0A0A0' }}>
        Usage Calendar (28 days)
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {entries.map(([date, hours]) => {
          const intensity = hours ? Math.max(0.18, hours / maxVal) : 0
          const bg = hours ? `rgba(0,212,170,${intensity})` : '#1A1A1A'
          return (
            <div
              key={date}
              title={`${fmtDate(date)}: ${hours}h`}
              className="rounded-sm cursor-pointer transition-opacity hover:opacity-75"
              style={{ background: bg, aspectRatio: '1' }}
              onClick={() => hours > 0 && alert(`${fmtDate(date)}\nUsage: ${hours.toFixed(1)} hours`)}
            />
          )
        })}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#1A1A1A' }} />
        <span className="text-xs" style={{ color: '#A0A0A0' }}>No use</span>
        <div className="w-2.5 h-2.5 rounded-sm ml-2" style={{ background: 'rgba(0,212,170,0.3)' }} />
        <span className="text-xs" style={{ color: '#A0A0A0' }}>Low</span>
        <div className="w-2.5 h-2.5 rounded-sm ml-2" style={{ background: 'rgba(0,212,170,0.9)' }} />
        <span className="text-xs" style={{ color: '#A0A0A0' }}>High</span>
      </div>
    </div>
  )
}
