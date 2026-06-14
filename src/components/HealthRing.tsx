import { motion } from 'framer-motion'

interface Props {
  health: number
  color: string
  children: React.ReactNode
}

const RADIUS = 130
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function HealthRing({ health, color, children }: Props) {
  const dashOffset = CIRCUMFERENCE * (1 - health / 100)

  return (
    <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
      <svg
        width="320"
        height="320"
        style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
      >
        <circle cx="160" cy="160" r={RADIUS} fill="none" stroke="#1E1E1E" strokeWidth="6" />
        <motion.circle
          cx="160"
          cy="160"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: dashOffset, stroke: color }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}