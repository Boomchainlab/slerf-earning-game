"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WalletConnect } from "@/components/wallet-connect"
import { ArrowLeft, Trophy, Medal, Award, Crown, Gamepad2, Wallet } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  address: string
  score: number
  tokensEarned: number
  gamesPlayed: number
  lastPlayed: string
}

export default function LeaderboardPage() {
  const { address, isConnected } = useAccount()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)
  const [timeFilter, setTimeFilter] = useState<"all" | "week" | "month">("all")
  const [showWalletModal, setShowWalletModal] = useState(false)

  useEffect(() => {
    // Simulate leaderboard data
    // In production, this would fetch from your backend API
    const generateLeaderboard = () => {
      const mockData: LeaderboardEntry[] = [
        {
          rank: 1,
          address: "0x1234...5678",
          score: 15420,
          tokensEarned: 1542.0,
          gamesPlayed: 45,
          lastPlayed: "2024-01-15T10:30:00Z",
        },
        {
          rank: 2,
          address: "0x2345...6789",
          score: 12890,
          tokensEarned: 1289.0,
          gamesPlayed: 38,
          lastPlayed: "2024-01-15T09:15:00Z",
        },
        {
          rank: 3,
          address: "0x3456...7890",
          score: 11750,
          tokensEarned: 1175.0,
          gamesPlayed: 42,
          lastPlayed: "2024-01-15T08:45:00Z",
        },
        {
          rank: 4,
          address: "0x4567...8901",
          score: 10320,
          tokensEarned: 1032.0,
          gamesPlayed: 29,
          lastPlayed: "2024-01-14T22:30:00Z",
        },
        {
          rank: 5,
          address: "0x5678...9012",
          score: 9850,
          tokensEarned: 985.0,
          gamesPlayed: 35,
          lastPlayed: "2024-01-14T20:15:00Z",
        },
        {
          rank: 6,
          address: "0x6789...0123",
          score: 8920,
          tokensEarned: 892.0,
          gamesPlayed: 31,
          lastPlayed: "2024-01-14T18:45:00Z",
        },
        {
          rank: 7,
          address: "0x7890...1234",
          score: 8450,
          tokensEarned: 845.0,
          gamesPlayed: 27,
          lastPlayed: "2024-01-14T16:20:00Z",
        },
        {
          rank: 8,
          address: "0x8901...2345",
          score: 7890,
          tokensEarned: 789.0,
          gamesPlayed: 33,
          lastPlayed: "2024-01-14T14:10:00Z",
        },
        {
          rank: 9,
          address: "0x9012...3456",
          score: 7320,
          tokensEarned: 732.0,
          gamesPlayed: 25,
          lastPlayed: "2024-01-14T12:30:00Z",
        },
        {
          rank: 10,
          address: "0x0123...4567",
          score: 6890,
          tokensEarned: 689.0,
          gamesPlayed: 28,
          lastPlayed: "2024-01-14T10:45:00Z",
        },
      ]

      // Add user's data if connected
      if (address) {
        const userScore = Number.parseInt(localStorage.getItem("slerfHighScore") || "0")
        if (userScore > 0) {
          const userEntry: LeaderboardEntry = {
            rank: mockData.findIndex((entry) => userScore > entry.score) + 1 || mockData.length + 1,
            address,
            score: userScore,
            tokensEarned: userScore * 0.1,
            gamesPlayed: Number.parseInt(localStorage.getItem("slerfGamesPlayed") || "1"),
            lastPlayed: new Date().toISOString(),
          }
          setUserRank(userEntry)
        }
      }

      setLeaderboard(mockData)
    }

    generateLeaderboard()
  }, [address])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <Trophy className="h-5 w-5 text-gray-500" />
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-black"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-black"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
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
                onClick={() => setShowWalletModal(false)}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
            <WalletConnect />
            <p className="text-white/70 text-sm mt-4 text-center">
              Connect your wallet to see your rank on the leaderboard
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
          <Trophy className="h-6 w-6" />
          <span className="text-lg font-semibold">Leaderboard</span>
        </div>

        <div className="flex space-x-2">
          <Link href="/play">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              <Gamepad2 className="mr-2 h-4 w-4" />
              Play Game
            </Button>
          </Link>
          {isConnected ? (
            <WalletConnect />
          ) : (
            <Button
              onClick={() => setShowWalletModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              variant="outline"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect
            </Button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Time Filter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1">
            {(["all", "week", "month"] as const).map((filter) => (
              <Button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                variant={timeFilter === filter ? "default" : "ghost"}
                className={`rounded-full px-6 ${
                  timeFilter === filter ? "bg-white text-black" : "text-white hover:bg-white/20"
                }`}
              >
                {filter === "all" ? "All Time" : filter === "week" ? "This Week" : "This Month"}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* User Rank Card */}
        {userRank && isConnected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 text-white cartoon-shadow">
              <CardHeader>
                <CardTitle className="text-center">Your Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getRankIcon(userRank.rank)}
                    <div>
                      <div className="font-bold text-lg">#{userRank.rank}</div>
                      <div className="text-sm opacity-80">{formatAddress(userRank.address)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-2xl">{userRank.score.toLocaleString()}</div>
                    <div className="text-sm opacity-80">{userRank.tokensEarned.toFixed(1)} SLERF</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* 2nd Place */}
            <div className="text-center pt-8">
              <Card className="bg-gradient-to-b from-gray-300 to-gray-500 text-black cartoon-shadow">
                <CardContent className="p-6">
                  <Medal className="h-12 w-12 mx-auto mb-3 text-gray-700" />
                  <div className="font-bold text-lg mb-1">#2</div>
                  <div className="text-sm mb-2">{formatAddress(leaderboard[1]?.address || "")}</div>
                  <div className="font-bold text-xl">{leaderboard[1]?.score.toLocaleString()}</div>
                  <div className="text-sm">{leaderboard[1]?.tokensEarned.toFixed(1)} SLERF</div>
                </CardContent>
              </Card>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <Card className="bg-gradient-to-b from-yellow-300 to-yellow-500 text-black cartoon-shadow transform scale-110">
                <CardContent className="p-6">
                  <Crown className="h-16 w-16 mx-auto mb-3 text-yellow-700" />
                  <div className="font-bold text-2xl mb-1">#1</div>
                  <div className="text-sm mb-2">{formatAddress(leaderboard[0]?.address || "")}</div>
                  <div className="font-bold text-3xl">{leaderboard[0]?.score.toLocaleString()}</div>
                  <div className="text-sm">{leaderboard[0]?.tokensEarned.toFixed(1)} SLERF</div>
                </CardContent>
              </Card>
            </div>

            {/* 3rd Place */}
            <div className="text-center pt-8">
              <Card className="bg-gradient-to-b from-amber-400 to-amber-600 text-black cartoon-shadow">
                <CardContent className="p-6">
                  <Award className="h-12 w-12 mx-auto mb-3 text-amber-800" />
                  <div className="font-bold text-lg mb-1">#3</div>
                  <div className="text-sm mb-2">{formatAddress(leaderboard[2]?.address || "")}</div>
                  <div className="font-bold text-xl">{leaderboard[2]?.score.toLocaleString()}</div>
                  <div className="text-sm">{leaderboard[2]?.tokensEarned.toFixed(1)} SLERF</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* Full Leaderboard */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Full Leaderboard</CardTitle>
              <CardDescription className="text-center text-white/70">
                Top players and their SLERF earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.address}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all hover:bg-white/10 ${
                      entry.address === address ? "bg-blue-500/20 border border-blue-400" : "bg-white/5"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <Badge className={`${getRankBadgeColor(entry.rank)} font-bold min-w-[3rem] justify-center`}>
                        #{entry.rank}
                      </Badge>
                      {getRankIcon(entry.rank)}
                      <div>
                        <div className="font-semibold">
                          {formatAddress(entry.address)}
                          {entry.address === address && (
                            <span className="ml-2 text-xs bg-blue-500 px-2 py-1 rounded-full">You</span>
                          )}
                        </div>
                        <div className="text-sm text-white/70">
                          {entry.gamesPlayed} games • {formatTimeAgo(entry.lastPlayed)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{entry.score.toLocaleString()}</div>
                      <div className="text-sm text-green-300">{entry.tokensEarned.toFixed(1)} SLERF</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {leaderboard.reduce((sum, entry) => sum + entry.tokensEarned, 0).toFixed(1)}
              </div>
              <div className="text-sm text-white/70">Total SLERF Distributed</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {leaderboard.reduce((sum, entry) => sum + entry.gamesPlayed, 0).toLocaleString()}
              </div>
              <div className="text-sm text-white/70">Total Games Played</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">{leaderboard.length}</div>
              <div className="text-sm text-white/70">Active Players</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
