import type { Cartridge, UsageLog } from '../types/cartridge'

export function getHealthPercent(cartridge: Cartridge): number {
  return Math.max(0, Math.round((cartridge.remainingHours / cartridge.lifespanHours) * 100))
}

export function getHealthColor(health: number): string {
  if (health > 50) return '#00D4AA'
  if (health > 25) return '#FFB020'
  if (health > 10) return '#FF8C00'
  return '#FF4D4D'
}

export function getHealthLabel(health: number): string {
  if (health > 75) return 'Excellent'
  if (health > 50) return 'Good'
  if (health > 25) return 'Low'
  if (health > 10) return 'Critical'
  return 'Replace Now'
}

export function getTotalUsed(logs: UsageLog[]): number {
  return logs.reduce((sum, l) => sum + l.hoursUsed, 0)
}

export function getActiveDays(logs: UsageLog[]): number {
  return new Set(logs.map(l => l.date)).size || 1
}

export function getAvgPerDay(logs: UsageLog[]): number {
  const total = getTotalUsed(logs)
  const days = getActiveDays(logs)
  return total / days
}

export function getDaysSinceStart(cartridge: Cartridge): number {
  return Math.floor((Date.now() - new Date(cartridge.startDate).getTime()) / 86400000)
}

export function formatRemaining(hours: number): string {
  const d = Math.floor(hours / 24)
  const h = Math.round(hours % 24)
  if (d > 0) return `${d}d ${h}h`
  return `${h}h`
}

export function formatCurrency(amount: number): string {
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID')
}
