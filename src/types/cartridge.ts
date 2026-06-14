export interface Cartridge {
  id: string
  name: string
  type: string
  startDate: string
  lifespanHours: number
  remainingHours: number
  price?: number
  createdAt: string
}

export interface UsageLog {
  id: string
  date: string
  hoursUsed: number
  note?: string
}

export interface ArchivedCartridge extends Cartridge {
  archivedAt: string
  totalUsedHours: number
}

export type CartridgeType = '0.3Ω' | '0.4Ω' | '0.6Ω' | '0.8Ω' | '1.0Ω'

export const CARTRIDGE_TYPES: CartridgeType[] = ['0.3Ω', '0.4Ω', '0.6Ω', '0.8Ω', '1.0Ω']

export const DEFAULT_LIFESPAN = 336
