import { useMemo } from 'react'
import { useCartridgeContext } from '../context/CartridgeContext'
import {
  getHealthPercent,
  getHealthColor,
  getHealthLabel,
  getTotalUsed,
  getAvgPerDay,
  getDaysSinceStart,
  formatRemaining,
  formatCurrency,
} from '../utils/calculateHealth'
import {
  predictEndDate,
  predictDaysLeft,
  getCostPerHour,
  getCostPerDay,
  buildCalendarData,
} from '../utils/prediction'

export function useCartridge() {
  const ctx = useCartridgeContext()
  const { cartridge, logs } = ctx

  const stats = useMemo(() => {
    if (!cartridge) return null
    const health = getHealthPercent(cartridge)
    return {
      health,
      healthColor: getHealthColor(health),
      healthLabel: getHealthLabel(health),
      totalUsed: getTotalUsed(logs),
      avgPerDay: getAvgPerDay(logs),
      daysSinceStart: getDaysSinceStart(cartridge),
      remainingFormatted: formatRemaining(cartridge.remainingHours),
      predictedEndDate: predictEndDate(cartridge, logs),
      daysLeft: predictDaysLeft(cartridge, logs),
      costPerHour: getCostPerHour(cartridge),
      costPerDay: getCostPerDay(cartridge, logs),
      costPerHourFormatted: cartridge.price ? formatCurrency(getCostPerHour(cartridge)!) : null,
      costPerDayFormatted: cartridge.price ? formatCurrency(getCostPerDay(cartridge, logs)!) : null,
      calendarData: buildCalendarData(logs),
    }
  }, [cartridge, logs])

  return { ...ctx, stats }
}
