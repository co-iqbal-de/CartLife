import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useCartridgeContext } from '../context/CartridgeContext'

interface Props {
  open: boolean
  onClose: () => void
}

const QUICK_HOURS = [1, 2, 3, 4]

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export default function UsageModal({ open, onClose }: Props) {
  const { addLog } = useCartridgeContext()
  const [date, setDate] = useState(todayStr())
  const [hours, setHours] = useState('')
  const [note, setNote] = useState('')
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    if (open) {
      setDate(todayStr())
      setHours('')
      setNote('')
      setSelected(null)
    }
  }, [open])

  function pickQuick(h: number) {
    setSelected(h)
    setHours(String(h))
  }

  function handleSave() {
    const h = parseFloat(hours)
    if (!date || !h || h <= 0) return alert('Please enter a valid date and hours.')
    addLog({ date, hoursUsed: h, note: note || undefined })
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="w-full max-w-md rounded-t-3xl p-6 border-t"
            style={{ background: '#1A1A1A', borderColor: '#2A2A2A' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: '#333' }} />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Log Usage</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#222' }}>
                <X size={16} color="#A0A0A0" />
              </button>
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="text-xs mb-1.5 block" style={{ color: '#A0A0A0' }}>Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
                style={{ background: '#222', border: '1px solid #2A2A2A' }}
              />
            </div>

            {/* Quick hours */}
            <div className="mb-4">
              <label className="text-xs mb-2 block" style={{ color: '#A0A0A0' }}>Quick select</label>
              <div className="grid grid-cols-4 gap-2">
                {QUICK_HOURS.map(h => (
                  <button
                    key={h}
                    onClick={() => pickQuick(h)}
                    className="rounded-xl py-2.5 text-sm font-semibold transition-all"
                    style={{
                      background: selected === h ? 'rgba(0,212,170,0.1)' : '#222',
                      border: `1px solid ${selected === h ? '#00D4AA' : '#2A2A2A'}`,
                      color: selected === h ? '#00D4AA' : '#fff',
                    }}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            {/* Custom hours */}
            <div className="mb-4">
              <label className="text-xs mb-1.5 block" style={{ color: '#A0A0A0' }}>Custom hours</label>
              <input
                type="number"
                value={hours}
                onChange={e => { setHours(e.target.value); setSelected(null) }}
                placeholder="e.g. 1.5"
                min="0.1"
                max="24"
                step="0.1"
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
                style={{ background: '#222', border: '1px solid #2A2A2A' }}
              />
            </div>

            {/* Note */}
            <div className="mb-5">
              <label className="text-xs mb-1.5 block" style={{ color: '#A0A0A0' }}>Notes (optional)</label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. heavy session"
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
                style={{ background: '#222', border: '1px solid #2A2A2A' }}
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full rounded-xl py-3.5 font-semibold text-sm mb-2"
              style={{ background: '#00D4AA', color: '#0D0D0D' }}
            >
              Save Usage
            </button>
            <button onClick={onClose} className="w-full py-3 text-sm" style={{ color: '#A0A0A0', background: 'none', border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
