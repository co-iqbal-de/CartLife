import type { Cartridge, UsageLog, ArchivedCartridge } from '../types/cartridge'

const KEYS = {
  CARTRIDGE: 'cartlife_cartridge',
  LOGS: 'cartlife_logs',
  HISTORY: 'cartlife_history',
  SETTINGS: 'cartlife_settings',
}

function parse<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Storage write error:', e)
  }
}

export const storage = {
  getCartridge: (): Cartridge | null => parse<Cartridge>(KEYS.CARTRIDGE),
  saveCartridge: (c: Cartridge): void => write(KEYS.CARTRIDGE, c),
  deleteCartridge: (): void => localStorage.removeItem(KEYS.CARTRIDGE),

  getLogs: (): UsageLog[] => parse<UsageLog[]>(KEYS.LOGS) ?? [],
  saveLogs: (logs: UsageLog[]): void => write(KEYS.LOGS, logs),

  getHistory: (): ArchivedCartridge[] => parse<ArchivedCartridge[]>(KEYS.HISTORY) ?? [],
  saveHistory: (history: ArchivedCartridge[]): void => write(KEYS.HISTORY, history),

  clearAll: (): void => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k))
  },

  exportAll: () => ({
    cartridge: parse<Cartridge>(KEYS.CARTRIDGE),
    logs: parse<UsageLog[]>(KEYS.LOGS) ?? [],
    history: parse<ArchivedCartridge[]>(KEYS.HISTORY) ?? [],
  }),

  importAll: (data: {
    cartridge?: Cartridge | null
    logs?: UsageLog[]
    history?: ArchivedCartridge[]
  }): void => {
    if (data.cartridge) write(KEYS.CARTRIDGE, data.cartridge)
    if (data.logs) write(KEYS.LOGS, data.logs)
    if (data.history) write(KEYS.HISTORY, data.history)
  },
}
