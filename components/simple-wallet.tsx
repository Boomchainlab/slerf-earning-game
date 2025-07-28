"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Check, Copy } from "lucide-react"

interface SimpleWalletProps {
  onConnect?: (address: string) => void
}

export function SimpleWallet({ onConnect }: SimpleWalletProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [copied, setCopied] = useState(false)

  const handleConnect = async () => {
    // Simulate wallet connection
    const mockAddress = "0x1234567890123456789012345678901234567890"
    setAddress(mockAddress)
    setIsConnected(true)
    onConnect?.(mockAddress)
  }

  const handleDisconnect = () => {
    setAddress("")
    setIsConnected(false)
  }

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.log("Copy failed:", err)
      }
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div>
                <div className="text-white font-medium">{formatAddress(address)}</div>
                <div className="text-white/70 text-sm">Base Network</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={copyAddress} size="sm" variant="ghost" className="text-white hover:bg-white/20">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button onClick={handleDisconnect} size="sm" variant="ghost" className="text-white hover:bg-white/20">
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleConnect}
        className="bg-white/20 hover:bg-white/30 text-white border-white/30 w-full justify-start"
        variant="outline"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Demo Wallet
      </Button>
      <p className="text-white/60 text-xs text-center">This is a demo wallet for testing purposes</p>
    </div>
  )
}
