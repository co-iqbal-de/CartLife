import type { Cartridge, UsageLog } from '../types/cartridge'
import { getAvgPerDay } from './calculateHealth'

export function predictEndDate(cartridge: Cartridge, logs: UsageLog[]): string {
  if (!logs.length) return '—'
  const avg = getAvgPerDay(logs)
  if (!avg) return '—'
  const daysLeft = Math.ceil(cartridge.remainingHours / avg)
  const d = new Date()
  d.setDate(d.getDate() + daysLeft)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function predictDaysLeft(cartridge: Cartridge, logs: UsageLog[]): number | null {
  if (!logs.length) return null
  const avg = getAvgPerDay(logs)
  if (!avg) return null
  return Math.ceil(cartridge.remainingHours / avg)
}

export function getCostPerHour(cartridge: Cartridge): number | null {
  if (!cartridge.price) return null
  return cartridge.price / cartridge.lifespanHours
}

export function getCostPerDay(cartridge: Cartridge, logs: UsageLog[]): number | null {
  const cph = getCostPerHour(cartridge)
  if (!cph) return null
  const avg = getAvgPerDay(logs)
  return cph * (avg || 2)
}

export function buildCalendarData(logs: UsageLog[], days = 28): Record<string, number> {
  const result: Record<string, number> = {}
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    result[d.toISOString().split('T')[0]] = 0
  }
  logs.forEach(l => {
    if (l.date in result) result[l.date] += l.hoursUsed
  })
  return result
}
