"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSLERFContracts } from "@/hooks/use-slerf-contracts"
import { useAccount } from "wagmi"
import { WalletConnect } from "@/components/wallet-connect"
import { Home, Trophy, Medal, Crown, Play, Coins, Users } from "lucide-react"

export default function LeaderboardPage() {
  const { isConnected, address } = useAccount()
  const { leaderboard, playerStats, refetchLeaderboard } = useSLERFContracts()
  const [refreshing, setRefreshing] = useState(false)

  // Auto-refresh leaderboard
  useEffect(() => {
    const interval = setInterval(() => {
      refetchLeaderboard()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [refetchLeaderboard])

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetchLeaderboard()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return <Trophy className="h-5 w-5 text-gray-500" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30"
      case 2:
        return "from-gray-400/20 to-gray-500/20 border-gray-400/30"
      case 3:
        return "from-amber-600/20 to-orange-600/20 border-amber-600/30"
      default:
        return "from-white/5 to-white/10 border-white/20"
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const isCurrentPlayer = (playerAddress: string) => {
    return address && playerAddress.toLowerCase() === address.toLowerCase()
  }

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
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Trophy className="h-10 w-10 text-yellow-400" />
              Global Leaderboard
            </h1>
            <p className="text-gray-300 text-lg">Compete with players worldwide and climb to the top!</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{leaderboard.length}</div>
                <div className="text-sm text-gray-400">Total Players</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {leaderboard.length > 0 ? leaderboard[0].score.toLocaleString() : "0"}
                </div>
                <div className="text-sm text-gray-400">Top Score</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Coins className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{playerStats?.highScore.toLocaleString() || "0"}</div>
                <div className="text-sm text-gray-400">Your Best</div>
              </CardContent>
            </Card>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <Trophy className="h-4 w-4 mr-2" />
              {refreshing ? "Refreshing..." : "Refresh Leaderboard"}
            </Button>
          </div>

          {/* Leaderboard */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Top Players
              </CardTitle>
              <CardDescription className="text-gray-300">Rankings based on highest single game score</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {leaderboard.length === 0 ? (
                <div className="p-8 text-center">
                  <Trophy className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Players Yet</h3>
                  <p className="text-gray-400 mb-6">Be the first to set a high score!</p>
                  <Link href="/play">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                      <Play className="h-4 w-4 mr-2" />
                      Start Playing
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 p-6">
                  {leaderboard.map((player, index) => (
                    <Card
                      key={player.address}
                      className={`bg-gradient-to-r ${getRankColor(player.rank)} backdrop-blur-sm ${
                        isCurrentPlayer(player.address) ? "ring-2 ring-blue-400" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getRankIcon(player.rank)}
                              <span className="text-2xl font-bold text-white">#{player.rank}</span>
                            </div>

                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                {player.address.slice(2, 4).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{formatAddress(player.address)}</span>
                                {isCurrentPlayer(player.address) && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                                  >
                                    You
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-400">
                                Earned: {(player.score * 0.1).toFixed(1)} SLERF
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">{player.score.toLocaleString()}</div>
                            <div className="text-sm text-gray-400">points</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Your Rank */}
          {isConnected && playerStats && playerStats.highScore > 0 && (
            <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-white">Your Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{playerStats.gamesPlayed}</div>
                    <div className="text-sm text-gray-400">Games Played</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{playerStats.highScore.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Personal Best</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{playerStats.totalScore.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Total Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{playerStats.tokensEarned}</div>
                    <div className="text-sm text-gray-400">SLERF Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Link href="/play">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Play className="h-4 w-4 mr-2" />
                Play Game
              </Button>
            </Link>
            <Link href="/claim">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Coins className="h-4 w-4 mr-2" />
                Claim Tokens
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
