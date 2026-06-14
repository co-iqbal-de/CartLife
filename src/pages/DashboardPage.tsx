import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Settings, Trash2 } from 'lucide-react'
import { useCartridge } from '../hooks/useCartridge'
import CartridgeVisual from '../components/CartridgeVisual'
import HealthRing from '../components/HealthRing'
import UsageModal from '../components/UsageModal'
import StatisticsCard from '../components/StatisticsCard'
import UsageCalendar from '../components/UsageCalendar'
import ReplaceHistory from '../components/ReplaceHistory'
import type { ArchivedCartridge } from '../types/cartridge'
import { storage } from '../utils/storage'

type Tab = 'dashboard' | 'history' | 'settings'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatRp(n: number) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID')
}

export default function DashboardPage() {
  const { cartridge, logs, history, stats, deleteLog, replaceCartridge, resetCartridge, clearAll, importData } = useCartridge()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [modalOpen, setModalOpen] = useState(false)

  if (!cartridge || !stats) return null

  const { health, healthColor, totalUsed, avgPerDay, daysSinceStart, predictedEndDate, calendarData } = stats
  const recentLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6)

  function handleExport() {
    const data = storage.exportAll()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'cartlife-backup.json'
    a.click()
  }

  function handleImport() {
    const inp = document.createElement('input')
    inp.type = 'file'
    inp.accept = '.json'
    inp.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string)
          importData(data)
        } catch { alert('Invalid backup file.') }
      }
      reader.readAsText(file)
    }
    inp.click()
  }

  function handleReplace() {
    if (confirm('Archive current cartridge and start a new one?')) replaceCartridge()
  }

  function handleReset() {
    if (confirm('Reset cartridge to full? Usage logs will be cleared.')) resetCartridge()
  }

  function handleClearAll() {
    if (confirm('Delete ALL data? This cannot be undone.')) clearAll()
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0D0D0D', color: '#fff' }}>
      {/* Dashboard Tab */}
      {tab === 'dashboard' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Header */}
          <div className="flex justify-between items-center px-5 pt-5 pb-2">
            <div>
              <div className="text-xs mb-0.5" style={{ color: '#A0A0A0' }}>
                {cartridge.type} · {fmtDate(cartridge.startDate)}
              </div>
              <div className="text-xl font-bold">{cartridge.name}</div>
            </div>
            <button
              onClick={() => setTab('settings')}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: '#1E1E1E', border: '1px solid #2A2A2A' }}
            >
              <Settings size={15} color="#A0A0A0" />
            </button>
          </div>

          {/* Notifications */}
          {health <= 5 && (
            <motion.div
              className="mx-4 mb-3 rounded-xl p-3 flex gap-2 items-start text-sm"
              style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.25)', color: '#FF4D4D' }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ⚠️ Replacement strongly recommended. Cartridge at critical level.
            </motion.div>
          )}
          {health > 5 && health <= 10 && (
            <div className="mx-4 mb-3 rounded-xl p-3 flex gap-2 items-start text-sm" style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.25)', color: '#FF4D4D' }}>
              ⚠️ Prepare a replacement cartridge. Almost empty.
            </div>
          )}
          {health > 10 && health <= 20 && (
            <div className="mx-4 mb-3 rounded-xl p-3 flex gap-2 items-start text-sm" style={{ background: 'rgba(255,176,32,0.1)', border: '1px solid rgba(255,176,32,0.25)', color: '#FFB020' }}>
              ℹ️ Cartridge entering end-of-life stage.
            </div>
          )}
          {health === 0 && (
            <div className="mx-4 mb-3 rounded-xl p-3 text-center font-semibold text-sm" style={{ background: 'rgba(255,77,77,0.15)', border: '1px solid rgba(255,77,77,0.3)', color: '#FF4D4D' }}>
              Replace Cartridge Recommended
            </div>
          )}

          {/* Cartridge + Ring */}
          <div className="flex justify-center py-4">
            <HealthRing health={health} color={healthColor}>
              <CartridgeVisual health={health} color={healthColor} />
              <div className="text-center mt-2">
                <div className="text-2xl font-bold" style={{ color: healthColor }}>{health}%</div>
                <div className="text-xs tracking-wider" style={{ color: '#A0A0A0' }}>HEALTH</div>
              </div>
            </HealthRing>
          </div>

          {/* Hours bar */}
          <div className="mx-4 mb-4 rounded-2xl p-4 flex justify-between items-center" style={{ background: '#151515', border: '1px solid #1E1E1E' }}>
            <div>
              <div className="font-semibold">{Math.round(cartridge.remainingHours)} / {cartridge.lifespanHours} Hours</div>
              <div className="text-xs mt-0.5" style={{ color: '#A0A0A0' }}>{stats.remainingFormatted} remaining</div>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
              style={{ background: '#00D4AA', color: '#0D0D0D' }}
            >
              <Plus size={15} />
              Add Usage
            </button>
          </div>

          {/* Cost tracker */}
          {cartridge.price && (
            <div className="mx-4 mb-4 rounded-2xl p-4 flex justify-around" style={{ background: '#151515', border: '1px solid #1E1E1E' }}>
              <CostItem label="per hour" value={formatRp(cartridge.price / cartridge.lifespanHours)} />
              <div style={{ width: 1, background: '#222' }} />
              <CostItem label="per day (avg)" value={formatRp((cartridge.price / cartridge.lifespanHours) * (avgPerDay || 2))} />
              <div style={{ width: 1, background: '#222' }} />
              <CostItem label="total price" value={formatRp(cartridge.price)} />
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2.5 mx-4 mb-4">
            <StatisticsCard label="Total usage" value={`${totalUsed.toFixed(1)}h`} />
            <StatisticsCard label="Avg per active day" value={`${avgPerDay.toFixed(1)}h`} />
            <StatisticsCard label="Days since start" value={`${daysSinceStart}d`} />
            <StatisticsCard label="Predicted end date" value={predictedEndDate} accent />
          </div>

          {/* Calendar */}
          <UsageCalendar data={calendarData} />

          {/* Recent logs */}
          <div className="text-xs font-semibold uppercase tracking-wider mx-4 mb-3" style={{ color: '#A0A0A0' }}>
            Recent Usage
          </div>
          {recentLogs.length === 0 ? (
            <div className="text-center py-6 text-sm" style={{ color: '#A0A0A0' }}>
              No usage logged yet. Tap Add Usage to start.
            </div>
          ) : (
            recentLogs.map(log => (
              <div key={log.id} className="flex justify-between items-center px-4 py-3" style={{ borderBottom: '1px solid #1A1A1A' }}>
                <div>
                  <div className="text-sm" style={{ color: '#A0A0A0' }}>{fmtDate(log.date)}</div>
                  {log.note && <div className="text-xs mt-0.5" style={{ color: '#444' }}>{log.note}</div>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold" style={{ color: '#00D4AA' }}>-{log.hoursUsed}h</div>
                  <button onClick={() => { if (confirm('Delete this log?')) deleteLog(log.id) }} style={{ color: '#444', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="px-5 pt-5 pb-3">
            <div className="text-xl font-bold">Cartridge History</div>
          </div>
          <ReplaceHistory history={history as ArchivedCartridge[]} currentName={cartridge.name} />
          <div className="mx-4 mt-4">
            <button
              onClick={handleReplace}
              className="w-full rounded-xl py-3.5 text-sm font-medium"
              style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.25)', color: '#FF4D4D' }}
            >
              Replace Cartridge
            </button>
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider mx-4 mt-6 mb-3" style={{ color: '#A0A0A0' }}>All Usage Logs</div>
          {[...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => (
            <div key={log.id} className="flex justify-between items-center px-4 py-3" style={{ borderBottom: '1px solid #1A1A1A' }}>
              <div>
                <div className="text-sm" style={{ color: '#A0A0A0' }}>{fmtDate(log.date)}</div>
                {log.note && <div className="text-xs mt-0.5" style={{ color: '#555' }}>{log.note}</div>}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold" style={{ color: '#00D4AA' }}>-{log.hoursUsed}h</div>
                <button onClick={() => { if (confirm('Delete this log?')) deleteLog(log.id) }} style={{ color: '#444', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Settings Tab */}
      {tab === 'settings' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="px-5 pt-5 pb-3">
            <div className="text-xl font-bold">Settings</div>
          </div>

          <SettingItem icon="⬇️" label="Export data" desc="Download your data as JSON" onClick={handleExport} />
          <SettingItem icon="⬆️" label="Import data" desc="Restore from JSON backup" onClick={handleImport} />
          <SettingItem icon="ℹ️" label="CartLife" desc="v1.0.0 · Local storage mode" onClick={() => {}} />

          <div className="mx-4 mt-6 flex flex-col gap-3">
            <button onClick={handleReset} className="w-full rounded-xl py-3.5 text-sm font-medium" style={{ background: 'rgba(255,176,32,0.1)', border: '1px solid rgba(255,176,32,0.25)', color: '#FFB020' }}>
              Reset Current Cartridge
            </button>
            <button onClick={handleClearAll} className="w-full rounded-xl py-3.5 text-sm font-medium" style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.4)', color: '#FF4D4D' }}>
              Clear All Data
            </button>
          </div>

          <div className="text-center text-xs mt-8 pb-4" style={{ color: '#333' }}>
            CartLife · Made for pod users
          </div>
        </motion.div>
      )}

      {/* Bottom Nav */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md flex border-t"
        style={{ background: 'rgba(13,13,13,0.95)', backdropFilter: 'blur(12px)', borderColor: '#1E1E1E', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <NavItem label="Dashboard" icon="💧" active={tab === 'dashboard'} onClick={() => setTab('dashboard')} />
        <NavItem label="History" icon="📋" active={tab === 'history'} onClick={() => setTab('history')} />
        <NavItem label="Settings" icon="⚙️" active={tab === 'settings'} onClick={() => setTab('settings')} />
      </div>

      <UsageModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

function NavItem({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-1 py-3 transition-all"
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: active ? '#00D4AA' : '#A0A0A0' }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontSize: 10, letterSpacing: '0.3px' }}>{label}</span>
    </button>
  )
}

function CostItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-bold" style={{ color: '#00D4AA', fontSize: 14 }}>{value}</div>
      <div className="text-xs mt-0.5" style={{ color: '#A0A0A0' }}>{label}</div>
    </div>
  )
}

function SettingItem({ icon, label, desc, onClick }: { icon: string; label: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-4 text-left"
      style={{ background: 'none', border: 'none', borderBottom: '1px solid #1A1A1A', cursor: 'pointer', color: '#fff' }}
    >
      <div>
        <div className="text-sm">{icon} {label}</div>
        <div className="text-xs mt-0.5" style={{ color: '#A0A0A0' }}>{desc}</div>
      </div>
      <span style={{ color: '#A0A0A0', fontSize: 18 }}>›</span>
    </button>
  )
}
