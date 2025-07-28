"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WalletConnect } from "@/components/wallet-connect"
import { useWallet } from "@/hooks/use-wallet"
import { Play, Trophy, Coins, TrendingUp, Users, Zap } from "lucide-react"

export default function HomePage() {
  const { isConnected } = useWallet()
  const [stats, setStats] = useState({
    totalPlayers: 1247,
    totalTokensEarned: 45623,
    gamesPlayed: 8934,
    topScore: 2847,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        totalPlayers: prev.totalPlayers + Math.floor(Math.random() * 3),
        totalTokensEarned: prev.totalTokensEarned + Math.floor(Math.random() * 10),
        gamesPlayed: prev.gamesPlayed + Math.floor(Math.random() * 5),
        topScore: Math.max(prev.topScore, prev.topScore + Math.floor(Math.random() * 50)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">SLERF Game</h1>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Earn SLERF Tokens
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Play our addictive cartoon runner game and earn real SLERF tokens on the Base blockchain. Jump, collect
            coins, and climb the leaderboard!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/play">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg px-8 py-3"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Playing
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-3 bg-transparent"
              >
                <Trophy className="h-5 w-5 mr-2" />
                Leaderboard
              </Button>
            </Link>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.totalPlayers.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Players</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Coins className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.totalTokensEarned.toLocaleString()}</div>
                <div className="text-sm text-gray-400">SLERF Earned</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <Play className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.gamesPlayed.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Games Played</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.topScore.toLocaleString()}</div>
                <div className="text-sm text-gray-400">High Score</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-white text-center mb-12">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <Play className="h-12 w-12 text-green-400 mb-4" />
              <CardTitle className="text-white">Play & Earn</CardTitle>
              <CardDescription className="text-gray-300">
                Jump over obstacles, collect coins, and earn 0.1 SLERF tokens per point scored
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <Coins className="h-12 w-12 text-yellow-400 mb-4" />
              <CardTitle className="text-white">Claim Rewards</CardTitle>
              <CardDescription className="text-gray-300">
                Accumulate tokens from multiple games and claim them to your wallet
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <Trophy className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">Compete</CardTitle>
              <CardDescription className="text-gray-300">
                Climb the global leaderboard and compete with players worldwide
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Token Info */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-white/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white mb-4">SLERF Token</CardTitle>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="secondary" className="bg-white/20 text-white">
                Base Chain
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                ERC-20
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Play-to-Earn
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-6">
              SLERF is a utility token built on Base chain. Earn tokens by playing games, use them for in-game
              purchases, or trade them on decentralized exchanges.
            </p>
            {isConnected ? (
              <Link href="/claim">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
                  <Coins className="h-4 w-4 mr-2" />
                  Claim Tokens
                </Button>
              </Link>
            ) : (
              <p className="text-yellow-400">Connect your wallet to start earning!</p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>&copy; 2024 SLERF Earning Game. Built on Base chain.</p>
        </div>
      </footer>
    </div>
  )
}
