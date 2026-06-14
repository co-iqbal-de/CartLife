import { useState } from 'react'
import { motion } from 'framer-motion'
import { CARTRIDGE_TYPES, DEFAULT_LIFESPAN, type CartridgeType } from '../types/cartridge'
import { useCartridgeContext } from '../context/CartridgeContext'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export default function SetupPage() {
  const { setCartridge } = useCartridgeContext()
  const [name, setName] = useState('')
  const [date, setDate] = useState(todayStr())
  const [type, setType] = useState<CartridgeType>('0.6Ω')
  const [lifespan, setLifespan] = useState(String(DEFAULT_LIFESPAN))
  const [price, setPrice] = useState('')

  function handleCreate() {
    const lifespanNum = parseFloat(lifespan) || DEFAULT_LIFESPAN
    setCartridge({
      id: Date.now().toString(),
      name: name.trim() || 'My Cartridge',
      type,
      startDate: date,
      lifespanHours: lifespanNum,
      remainingHours: lifespanNum,
      price: price ? parseFloat(price) : undefined,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6 pb-8" style={{ background: '#0D0D0D' }}>
      {/* Brand */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-3xl font-bold tracking-tight mb-1">
          Cart<span style={{ color: '#00D4AA' }}>Life</span>
        </div>
        <div className="text-sm leading-relaxed" style={{ color: '#A0A0A0' }}>
          Track your pod cartridge lifespan<br />based on actual usage hours
        </div>
      </motion.div>

      {/* Cartridge illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <svg viewBox="0 0 120 148" width="120" height="148">
          <defs>
            <linearGradient id="lgSetup" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00A37A" stopOpacity="0.7" />
            </linearGradient>
            <clipPath id="cpSetup">
              <rect x="10" y="14" width="100" height="118" rx="22" />
            </clipPath>
          </defs>
          <rect x="10" y="14" width="100" height="118" rx="22" fill="rgba(255,255,255,0.03)" stroke="#00D4AA" strokeWidth="2" />
          <rect x="11" y="15" width="98" height="116" fill="url(#lgSetup)" clipPath="url(#cpSetup)" opacity="0.85" />
          <rect x="20" y="108" width="80" height="20" rx="4" fill="rgba(0,0,0,0.4)" clipPath="url(#cpSetup)" />
          <path d="M 45 14 L 45 6 Q 45 2 50 2 L 70 2 Q 75 2 75 6 L 75 14" fill="rgba(255,255,255,0.05)" stroke="#00D4AA" strokeWidth="1.5" />
          <circle cx="60" cy="8" r="3" fill="#00D4AA" />
          <rect x="36" y="72" width="48" height="16" rx="4" fill="rgba(0,0,0,0.3)" />
          <text x="60" y="84" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="system-ui">OPEN →</text>
          <rect x="22" y="128" width="76" height="12" rx="6" fill="rgba(255,255,255,0.04)" stroke="#00D4AA" strokeWidth="1.5" />
        </svg>
      </motion.div>

      {/* Form card */}
      <motion.div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: '#151515', border: '1px solid #222' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Field label="Cartridge name (optional)">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. My Pod #1"
            className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
            style={{ background: '#1E1E1E', border: '1px solid #2A2A2A' }}
          />
        </Field>

        <Field label="Start date">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
            style={{ background: '#1E1E1E', border: '1px solid #2A2A2A' }}
          />
        </Field>

        <Field label="Cartridge type">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
            {CARTRIDGE_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="rounded-lg py-2.5 text-xs font-medium transition-all"
                style={{
                  background: type === t ? 'rgba(0,212,170,0.08)' : '#1E1E1E',
                  border: `1px solid ${type === t ? '#00D4AA' : '#2A2A2A'}`,
                  color: type === t ? '#00D4AA' : '#A0A0A0',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Estimated lifespan (hours)">
          <input
            type="number"
            value={lifespan}
            onChange={e => setLifespan(e.target.value)}
            min="1"
            max="9999"
            className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
            style={{ background: '#1E1E1E', border: '1px solid #2A2A2A' }}
          />
        </Field>

        <Field label="Price in Rp (optional)">
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="e.g. 50000"
            className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
            style={{ background: '#1E1E1E', border: '1px solid #2A2A2A' }}
          />
        </Field>

        <button
          onClick={handleCreate}
          className="w-full rounded-xl py-3.5 font-semibold text-sm transition-opacity active:opacity-80"
          style={{ background: '#00D4AA', color: '#0D0D0D' }}
        >
          Create Cartridge
        </button>
      </motion.div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-xs mb-1.5" style={{ color: '#A0A0A0' }}>{label}</div>
      {children}
    </div>
  )
}
