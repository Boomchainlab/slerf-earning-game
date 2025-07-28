"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletConnect } from "@/components/wallet-connect"
import { ArrowLeft, Coins, Download, CheckCircle, Clock, Wallet } from "lucide-react"

interface ClaimData {
  totalEarned: number
  availableToClaim: number
  lastGameScore: number
  totalGamesPlayed: number
  claimHistory: Array<{
    date: string
    amount: number
    txHash?: string
  }>
}

export default function ClaimPage() {
  const { isConnected, address } = useAccount()
  const router = useRouter()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [claimData, setClaimData] = useState<ClaimData>({
    totalEarned: 0,
    availableToClaim: 0,
    lastGameScore: 0,
    totalGamesPlayed: 0,
    claimHistory: [],
  })
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)

  // Show wallet modal if not connected
  useEffect(() => {
    if (!isConnected) {
      setShowWalletModal(true)
    }
  }, [isConnected])

  // Load claim data
  useEffect(() => {
    if (!address) return

    // Simulate loading user's earning data
    // In production, this would fetch from your backend API
    const loadClaimData = () => {
      const highScore = Number.parseInt(localStorage.getItem("slerfHighScore") || "0")
      const gamesPlayed = Number.parseInt(localStorage.getItem("slerfGamesPlayed") || "0")
      const totalEarned = highScore * 0.1
      const lastClaim = localStorage.getItem("slerfLastClaim")
      const lastClaimAmount = Number.parseFloat(localStorage.getItem("slerfLastClaimAmount") || "0")

      setClaimData({
        totalEarned,
        availableToClaim: totalEarned - lastClaimAmount,
        lastGameScore: highScore,
        totalGamesPlayed: Math.max(1, gamesPlayed),
        claimHistory: lastClaim
          ? [
              {
                date: lastClaim,
                amount: lastClaimAmount,
                txHash: "0x1234...5678",
              },
            ]
          : [],
      })
    }

    loadClaimData()
  }, [address])

  const handleClaim = async () => {
    if (claimData.availableToClaim <= 0) return

    setIsClaiming(true)

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Update local storage
      localStorage.setItem("slerfLastClaim", new Date().toISOString())
      localStorage.setItem("slerfLastClaimAmount", claimData.totalEarned.toString())

      // Update claim data
      setClaimData((prev) => ({
        ...prev,
        availableToClaim: 0,
        claimHistory: [
          {
            date: new Date().toISOString(),
            amount: prev.availableToClaim,
            txHash: "0xabcd...efgh",
          },
          ...prev.claimHistory,
        ],
      }))

      setClaimSuccess(true)
      setTimeout(() => setClaimSuccess(false), 5000)
    } catch (error) {
      console.error("Claim failed:", error)
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      {/* Wallet Modal */}
      {showWalletModal && !isConnected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
              <Button
                onClick={() => {
                  setShowWalletModal(false)
                  router.push("/")
                }}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
            <WalletConnect />
            <p className="text-white/70 text-sm mt-4 text-center">
              Connect your wallet to claim your earned SLERF tokens
            </p>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <Link href="/">
          <Button variant="outline" className="bg-white/20 border-white text-white hover:bg-white/30">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="flex items-center space-x-2 text-white">
          <Coins className="h-6 w-6" />
          <span className="text-lg font-semibold">Claim SLERF Tokens</span>
        </div>

        {isConnected ? (
          <WalletConnect />
        ) : (
          <Button
            onClick={() => setShowWalletModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            variant="outline"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        )}
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Success Message */}
        {claimSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Card className="bg-green-500 border-green-400 text-white">
              <CardContent className="flex items-center p-4">
                <CheckCircle className="h-6 w-6 mr-3" />
                <span className="font-semibold">Successfully claimed SLERF tokens!</span>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {isConnected ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Claim Section */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white cartoon-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold flex items-center justify-center">
                    <Coins className="mr-3 h-8 w-8 text-yellow-400" />
                    Claim Your SLERF
                  </CardTitle>
                  <CardDescription className="text-white/80 text-lg">
                    Earned from your gaming performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Available to Claim */}
                  <div className="text-center p-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl">
                    <div className="text-sm font-medium text-black/70 mb-1">Available to Claim</div>
                    <div className="text-4xl font-bold text-black">{claimData.availableToClaim.toFixed(2)} SLERF</div>
                    <div className="text-sm text-black/70 mt-1">
                      ≈ ${(claimData.availableToClaim * 0.05).toFixed(2)} USD
                    </div>
                  </div>

                  {/* Claim Button */}
                  <Button
                    onClick={handleClaim}
                    disabled={isClaiming || claimData.availableToClaim <= 0}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 text-lg rounded-full cartoon-shadow"
                    size="lg"
                  >
                    {isClaiming ? (
                      <>
                        <Clock className="mr-2 h-5 w-5 animate-spin" />
                        Claiming...
                      </>
                    ) : claimData.availableToClaim <= 0 ? (
                      "No Tokens to Claim"
                    ) : (
                      <>
                        <Download className="mr-2 h-5 w-5" />
                        Claim SLERF Tokens
                      </>
                    )}
                  </Button>

                  {claimData.availableToClaim <= 0 && (
                    <div className="text-center">
                      <p className="text-white/70 mb-4">Play more games to earn SLERF tokens!</p>
                      <Link href="/play">
                        <Button className="bg-purple-500 hover:bg-purple-600 text-white">Play Game</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats & History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Stats Card */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Your Gaming Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/10 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">{claimData.totalEarned.toFixed(2)}</div>
                      <div className="text-sm text-white/70">Total Earned</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{claimData.lastGameScore.toLocaleString()}</div>
                      <div className="text-sm text-white/70">Best Score</div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{claimData.totalGamesPlayed}</div>
                    <div className="text-sm text-white/70">Games Played</div>
                  </div>
                </CardContent>
              </Card>

              {/* Claim History */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Claim History</CardTitle>
                </CardHeader>
                <CardContent>
                  {claimData.claimHistory.length > 0 ? (
                    <div className="space-y-3">
                      {claimData.claimHistory.map((claim, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                          <div>
                            <div className="font-semibold">{claim.amount.toFixed(2)} SLERF</div>
                            <div className="text-sm text-white/70">{new Date(claim.date).toLocaleDateString()}</div>
                          </div>
                          {claim.txHash && <div className="text-xs text-blue-300 font-mono">{claim.txHash}</div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-white/70 py-8">
                      <Coins className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No claims yet</p>
                      <p className="text-sm">Play games to start earning!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <div className="text-center">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white max-w-md mx-auto">
              <CardContent className="p-8">
                <Wallet className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="text-white/70 mb-6">
                  You need to connect your wallet to view and claim your SLERF tokens
                </p>
                <Button
                  onClick={() => setShowWalletModal(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                >
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-center">How SLERF Earning Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl mb-3">🎮</div>
                  <h3 className="font-semibold mb-2">Play Games</h3>
                  <p className="text-sm text-white/70">Play our fun cartoon runner game and achieve high scores</p>
                </div>
                <div>
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="font-semibold mb-2">Earn Tokens</h3>
                  <p className="text-sm text-white/70">
                    Get SLERF tokens based on your performance (0.1 SLERF per point)
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-3">💰</div>
                  <h3 className="font-semibold mb-2">Claim Rewards</h3>
                  <p className="text-sm text-white/70">
                    Claim your earned tokens directly to your wallet on Base chain
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
