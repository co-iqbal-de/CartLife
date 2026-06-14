import { motion } from 'framer-motion'

interface Props {
  health: number
  color: string
}

export default function CartridgeVisual({ health, color }: Props) {
  const fillPercent = health / 100
  const fillHeight = Math.round(fillPercent * 102)
  const fillY = 18 + (102 - fillHeight)
  const opacity = 0.3 + fillPercent * 0.7
  const isCritical = health <= 10
  const isEmpty = health === 0

  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 190 }}>
      <motion.svg
        viewBox="0 0 120 148"
        width="150"
        height="178"
        animate={isCritical && !isEmpty ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
        transition={isCritical ? { duration: 1.5, repeat: Infinity } : {}}
      >
        <defs>
          <linearGradient id="lgLiquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.55" />
          </linearGradient>
          <clipPath id="cpCart">
            <rect x="10" y="14" width="100" height="118" rx="22" />
          </clipPath>
        </defs>

        {/* Main body */}
        <rect
          x="10" y="14" width="100" height="118" rx="22"
          fill="rgba(255,255,255,0.03)"
          stroke={color}
          strokeWidth={isCritical ? 1 : 2}
          opacity={opacity}
        />

        {/* Liquid fill */}
        <motion.rect
          x="11"
          y={fillY}
          width="98"
          height={fillHeight}
          fill="url(#lgLiquid)"
          clipPath="url(#cpCart)"
          initial={false}
          animate={{ height: fillHeight, y: fillY }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          opacity={Math.min(1, opacity + 0.1)}
        />

        {/* Inner glass effect */}
        <rect x="10" y="14" width="100" height="118" rx="22" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* Coil / base section */}
        <rect x="20" y="108" width="80" height="20" rx="4" fill="rgba(0,0,0,0.4)" clipPath="url(#cpCart)" />
        <rect x="30" y="114" width="60" height="6" rx="3" fill="rgba(255,255,255,0.07)" />

        {/* Top funnel */}
        <path
          d="M 45 14 L 45 6 Q 45 2 50 2 L 70 2 Q 75 2 75 6 L 75 14"
          fill="rgba(255,255,255,0.05)"
          stroke={color}
          strokeWidth={isCritical ? 1 : 1.5}
          opacity={opacity}
        />

        {/* Center pin */}
        <circle cx="60" cy="8" r="3" fill={color} opacity={opacity} />

        {/* Neck */}
        <rect x="52" y="55" width="16" height="4" rx="2" fill="rgba(255,255,255,0.1)" />

        {/* Open label */}
        <rect x="36" y="72" width="48" height="16" rx="4" fill="rgba(0,0,0,0.3)" />
        <text x="60" y="84" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.25)" fontFamily="system-ui">
          OPEN →
        </text>

        {/* Base */}
        <rect
          x="22" y="128" width="76" height="12" rx="6"
          fill="rgba(255,255,255,0.04)"
          stroke={color}
          strokeWidth={isCritical ? 0.75 : 1.5}
          opacity={opacity}
        />

        {/* Crack overlay when empty */}
        {isEmpty && (
          <g opacity="0.7">
            <line x1="30" y1="40" x2="50" y2="70" stroke="#FF4D4D" strokeWidth="1.5" />
            <line x1="50" y1="70" x2="35" y2="95" stroke="#FF4D4D" strokeWidth="1.5" />
            <line x1="70" y1="50" x2="85" y2="80" stroke="#FF4D4D" strokeWidth="1.5" />
            <line x1="85" y1="80" x2="78" y2="100" stroke="#FF4D4D" strokeWidth="1" />
          </g>
        )}
      </motion.svg>
    </div>
  )
}
