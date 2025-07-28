"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

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
    // Return default values when not in provider
    return {
      isConnected: false,
      address: null,
      connect: async () => {},
      disconnect: () => {},
    }
  }
  return context
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    // Check if wallet was previously connected
    const savedAddress = localStorage.getItem("walletAddress")
    const savedConnection = localStorage.getItem("walletConnected")

    if (savedAddress && savedConnection === "true") {
      setAddress(savedAddress)
      setIsConnected(true)
    }
  }, [])

  const connect = async () => {
    try {
      // Simulate wallet connection
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`
      setAddress(mockAddress)
      setIsConnected(true)

      // Save to localStorage
      localStorage.setItem("walletAddress", mockAddress)
      localStorage.setItem("walletConnected", "true")
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)

    // Clear localStorage
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletConnected")
  }

  return (
    <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>{children}</WalletContext.Provider>
  )
}
