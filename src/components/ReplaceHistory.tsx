import type { ArchivedCartridge } from '../types/cartridge'

interface Props {
  history: ArchivedCartridge[]
  currentName?: string
}

export default function ReplaceHistory({ history, currentName }: Props) {
  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const all = [
    ...history.map((c, i) => ({ ...c, index: i + 1, isCurrent: false })),
    currentName ? { index: history.length + 1, name: currentName, isCurrent: true, startDate: '', archivedAt: '', totalUsedHours: 0, type: '', id: '', lifespanHours: 0, remainingHours: 0, createdAt: '' } : null,
  ].filter(Boolean) as Array<{ index: number; name: string; isCurrent: boolean } & Partial<ArchivedCartridge>>

  if (!all.length) return (
    <div className="text-center py-10 text-sm" style={{ color: '#A0A0A0' }}>No cartridge history yet.</div>
  )

  return (
    <div>
      {all.map(item => (
        <div key={item.index} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid #1A1A1A' }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: '#1E1E1E',
              border: `1px solid ${item.isCurrent ? '#00D4AA' : '#2A2A2A'}`,
              color: item.isCurrent ? '#00D4AA' : '#A0A0A0',
            }}
          >
            {item.index}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">{item.name}</div>
            {!item.isCurrent && item.type && (
              <div className="text-xs mt-0.5" style={{ color: '#A0A0A0' }}>
                {item.type} · Started {fmtDate(item.startDate ?? '')} · Used {Math.round(item.totalUsedHours ?? 0)}h
              </div>
            )}
          </div>
          {item.isCurrent ? (
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(0,212,170,0.1)', color: '#00D4AA', border: '1px solid rgba(0,212,170,0.2)' }}>
              Current
            </span>
          ) : (
            <span className="text-xs" style={{ color: '#555' }}>Archived</span>
          )}
        </div>
      ))}
    </div>
  )
}
