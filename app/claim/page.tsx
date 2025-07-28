"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useSLERFContracts } from "@/hooks/use-slerf-contracts"
import { useAccount } from "wagmi"
import { WalletConnect } from "@/components/wallet-connect"
import { Home, Coins, Trophy, Play, Wallet } from "lucide-react"
import { toast } from "sonner"

export default function ClaimPage() {
  const { isConnected, address } = useAccount()
  const {
    claimTokens,
    isPending,
    isConfirmed,
    playerStats,
    pendingTokens,
    tokenBalance,
    refetchPlayerStats,
    refetchPendingTokens,
  } = useSLERFContracts()

  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState(0)

  // Calculate time until next claim
  useEffect(() => {
    if (playerStats?.lastClaimTime) {
      const nextClaimTime = playerStats.lastClaimTime + 3600 // 1 hour cooldown
      const now = Math.floor(Date.now() / 1000)
      const timeLeft = Math.max(0, nextClaimTime - now)
      setTimeUntilNextClaim(timeLeft)

      if (timeLeft > 0) {
        const interval = setInterval(() => {
          const currentTime = Math.floor(Date.now() / 1000)
          const remaining = Math.max(0, nextClaimTime - currentTime)
          setTimeUntilNextClaim(remaining)

          if (remaining === 0) {
            clearInterval(interval)
          }
        }, 1000)

        return () => clearInterval(interval)
      }
    }
  }, [playerStats?.lastClaimTime])

  const handleClaim = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet")
      return
    }

    if (timeUntilNextClaim > 0) {
      toast.error("Claim cooldown is still active")
      return
    }

    if (!pendingTokens || Number.parseFloat(pendingTokens) === 0) {
      toast.error("No tokens to claim")
      return
    }

    try {
      await claimTokens()
      toast.success("Claim transaction submitted!")
    } catch (error) {
      toast.error("Failed to claim tokens")
      console.error(error)
    }
  }

  // Handle confirmed transaction
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Tokens claimed successfully!")
      refetchPlayerStats()
      refetchPendingTokens()
    }
  }, [isConfirmed, refetchPlayerStats, refetchPendingTokens])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const canClaim = timeUntilNextClaim === 0 && pendingTokens && Number.parseFloat(pendingTokens) > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-gray-300">
            <Home className="h-5 w-5" />
            <span className="font-semibold">SLERF Game</span>
          </Link>
          <WalletConnect />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Claim SLERF Tokens</h1>
            <p className="text-gray-300 text-lg">Claim your earned SLERF tokens and add them to your wallet</p>
          </div>

          {!isConnected ? (
            /* Wallet Connection Required */
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                <p className="text-gray-300 mb-6">
                  You need to connect your wallet to view and claim your SLERF tokens
                </p>
                <WalletConnect />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Claim Summary */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Coins className="h-5 w-5" />
                      Pending Tokens
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400 mb-2">{pendingTokens || "0"} SLERF</div>
                    <p className="text-gray-300 text-sm">Ready to claim</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Wallet Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-400 mb-2">{tokenBalance || "0"} SLERF</div>
                    <p className="text-gray-300 text-sm">Current balance</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Total Earned
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {playerStats?.tokensEarned || "0"} SLERF
                    </div>
                    <p className="text-gray-300 text-sm">Lifetime earnings</p>
                  </CardContent>
                </Card>
              </div>

              {/* Claim Action */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-center">Claim Your Tokens</CardTitle>
                  <CardDescription className="text-center text-gray-300">
                    {timeUntilNextClaim > 0
                      ? `Next claim available in ${formatTime(timeUntilNextClaim)}`
                      : "Your tokens are ready to claim!"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {timeUntilNextClaim > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Cooldown Progress</span>
                        <span>{formatTime(timeUntilNextClaim)} remaining</span>
                      </div>
                      <Progress value={((3600 - timeUntilNextClaim) / 3600) * 100} className="h-2" />
                    </div>
                  )}

                  <div className="text-center space-y-4">
                    <Button
                      onClick={handleClaim}
                      disabled={!canClaim || isPending}
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
                    >
                      <Coins className="h-5 w-5 mr-2" />
                      {isPending ? "Claiming..." : `Claim ${pendingTokens || "0"} SLERF`}
                    </Button>

                    {!canClaim && timeUntilNextClaim === 0 && (
                      <p className="text-yellow-400 text-sm">
                        No tokens available to claim. Play more games to earn SLERF!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Player Stats */}
              {playerStats && (
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Your Game Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{playerStats.gamesPlayed}</div>
                        <div className="text-sm text-gray-400">Games Played</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{playerStats.totalScore.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">Total Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{playerStats.highScore.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">High Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{playerStats.tokensClaimed}</div>
                        <div className="text-sm text-gray-400">Tokens Claimed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <Link href="/play">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Play className="h-4 w-4 mr-2" />
                    Play More Games
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                    <Trophy className="h-4 w-4 mr-2" />
                    View Leaderboard
                  </Button>
                </Link>
              </div>

              {/* Token Info */}
              <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Coins className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">SLERF Token</h3>
                      <p className="text-gray-300 text-sm">
                        ERC-20 token on Base blockchain • 0.1 SLERF per point scored
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
