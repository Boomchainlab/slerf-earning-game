"use client"

import { useState, useEffect, createContext, useContext } from "react"
import type { ReactNode } from "react"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | null>(null)

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    return {
      isConnected: false,
      address: null,
      connect: async () => {},
      disconnect: () => {},
    }
  }
  return context
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress")
    const savedConnection = localStorage.getItem("walletConnected")

    if (savedAddress && savedConnection === "true") {
      setAddress(savedAddress)
      setIsConnected(true)
    }
  }, [])

  const connect = async () => {
    try {
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`
      setAddress(mockAddress)
      setIsConnected(true)

      localStorage.setItem("walletAddress", mockAddress)
      localStorage.setItem("walletConnected", "true")
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)

    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletConnected")
  }

  return (
    <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>{children}</WalletContext.Provider>
  )
}
