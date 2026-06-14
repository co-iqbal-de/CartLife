import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Cartridge, UsageLog, ArchivedCartridge } from '../types/cartridge'
import { storage } from '../utils/storage'

interface CartridgeContextValue {
  cartridge: Cartridge | null
  logs: UsageLog[]
  history: ArchivedCartridge[]
  setCartridge: (c: Cartridge | null) => void
  addLog: (log: Omit<UsageLog, 'id'>) => void
  deleteLog: (id: string) => void
  replaceCartridge: () => void
  resetCartridge: () => void
  clearAll: () => void
  importData: (data: { cartridge?: Cartridge | null; logs?: UsageLog[]; history?: ArchivedCartridge[] }) => void
}

const CartridgeContext = createContext<CartridgeContextValue | null>(null)

export function CartridgeProvider({ children }: { children: ReactNode }) {
  const [cartridge, setCartridgeState] = useState<Cartridge | null>(() => storage.getCartridge())
  const [logs, setLogs] = useState<UsageLog[]>(() => storage.getLogs())
  const [history, setHistory] = useState<ArchivedCartridge[]>(() => storage.getHistory())

  const setCartridge = useCallback((c: Cartridge | null) => {
    setCartridgeState(c)
    if (c) storage.saveCartridge(c)
    else storage.deleteCartridge()
  }, [])

  const addLog = useCallback((entry: Omit<UsageLog, 'id'>) => {
    const log: UsageLog = { ...entry, id: Date.now().toString() }
    setLogs(prev => {
      const next = [...prev, log]
      storage.saveLogs(next)
      return next
    })
    setCartridgeState(prev => {
      if (!prev) return prev
      const updated = { ...prev, remainingHours: Math.max(0, prev.remainingHours - entry.hoursUsed) }
      storage.saveCartridge(updated)
      return updated
    })
  }, [])

  const deleteLog = useCallback((id: string) => {
    setLogs(prev => {
      const log = prev.find(l => l.id === id)
      if (!log) return prev
      const next = prev.filter(l => l.id !== id)
      storage.saveLogs(next)
      setCartridgeState(c => {
        if (!c) return c
        const updated = { ...c, remainingHours: Math.min(c.lifespanHours, c.remainingHours + log.hoursUsed) }
        storage.saveCartridge(updated)
        return updated
      })
      return next
    })
  }, [])

  const replaceCartridge = useCallback(() => {
    if (!cartridge) return
    const archived: ArchivedCartridge = {
      ...cartridge,
      archivedAt: new Date().toISOString(),
      totalUsedHours: cartridge.lifespanHours - cartridge.remainingHours,
    }
    setHistory(prev => {
      const next = [...prev, archived]
      storage.saveHistory(next)
      return next
    })
    setCartridgeState(null)
    storage.deleteCartridge()
    setLogs([])
    storage.saveLogs([])
  }, [cartridge])

  const resetCartridge = useCallback(() => {
    setCartridgeState(prev => {
      if (!prev) return prev
      const updated = { ...prev, remainingHours: prev.lifespanHours }
      storage.saveCartridge(updated)
      return updated
    })
    setLogs([])
    storage.saveLogs([])
  }, [])

  const clearAll = useCallback(() => {
    storage.clearAll()
    setCartridgeState(null)
    setLogs([])
    setHistory([])
  }, [])

  const importData = useCallback((data: Parameters<CartridgeContextValue['importData']>[0]) => {
    storage.importAll(data)
    if (data.cartridge) setCartridgeState(data.cartridge)
    if (data.logs) setLogs(data.logs)
    if (data.history) setHistory(data.history)
  }, [])

  return (
    <CartridgeContext.Provider value={{ cartridge, logs, history, setCartridge, addLog, deleteLog, replaceCartridge, resetCartridge, clearAll, importData }}>
      {children}
    </CartridgeContext.Provider>
  )
}

export function useCartridgeContext() {
  const ctx = useContext(CartridgeContext)
  if (!ctx) throw new Error('useCartridgeContext must be used within CartridgeProvider')
  return ctx
}
