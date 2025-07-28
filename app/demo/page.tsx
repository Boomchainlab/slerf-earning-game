"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleWallet } from "@/components/simple-wallet"
import { Gamepad2, Trophy, Coins, TrendingUp, Wallet, ArrowLeft } from "lucide-react"

export default function DemoPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)

  const handleWalletConnect = (address: string) => {
    setIsConnected(true)
    setShowWalletModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline" className="bg-white/20 border-white text-white hover:bg-white/30">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cartoon-shadow">
              <span className="text-2xl">🦥</span>
            </div>
            <h1 className="text-2xl font-bold text-white">SLERF Game Demo</h1>
          </motion.div>
        </div>

        {isConnected ? (
          <SimpleWallet />
        ) : (
          <Button
            onClick={() => setShowWalletModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            variant="outline"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Demo Wallet
          </Button>
        )}
      </header>

      {/* Wallet Modal */}
      {showWalletModal && !isConnected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Connect Demo Wallet</h2>
              <Button
                onClick={() => setShowWalletModal(false)}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
            <SimpleWallet onConnect={handleWalletConnect} />
            <p className="text-white/70 text-sm mt-4 text-center">
              This demo wallet simulates Web3 functionality for testing
            </p>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Play & Earn
              <span className="block text-yellow-300">SLERF Tokens!</span>
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Connect your demo wallet, play our fun cartoon game, and earn SLERF tokens based on your score. This is a
              fully functional demo!
            </p>
          </motion.div>

          {/* Game Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-12"
          >
            <div className="relative mx-auto w-80 h-60 bg-gradient-to-b from-sky-400 to-green-400 rounded-3xl cartoon-shadow overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="text-6xl"
                >
                  🦥
                </motion.div>
                <motion.div
                  animate={{ x: [0, 20, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  className="text-3xl ml-8"
                >
                  🪙
                </motion.div>
              </div>
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full">
                <span className="text-sm font-bold text-purple-600">Score: 1,250</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            {isConnected ? (
              <>
                <Link href="/play">
                  <Button
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-full cartoon-shadow"
                  >
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    Start Playing
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/20 border-white text-white hover:bg-white/30 px-8 py-4 rounded-full"
                  >
                    <Trophy className="mr-2 h-5 w-5" />
                    Leaderboard
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                onClick={() => setShowWalletModal(true)}
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-full cartoon-shadow"
              >
                <Wallet className="mr-2 h-5 w-5" />
                Connect Demo Wallet to Play
              </Button>
            )}
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Gamepad2, title: "Fun Gameplay", desc: "Cartoon-style mini game with smooth controls" },
            { icon: Coins, title: "Earn SLERF", desc: "Get tokens based on your game performance" },
            { icon: Trophy, title: "Leaderboard", desc: "Compete with other players globally" },
            { icon: TrendingUp, title: "Live Analytics", desc: "Real-time token price and charts" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="text-center">
                  <feature.icon className="h-12 w-12 mx-auto mb-2 text-yellow-300" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/80">{feature.desc}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Demo Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-blue-500/20 backdrop-blur-sm rounded-3xl p-6 cartoon-shadow border border-blue-400/30"
        >
          <div className="text-center text-white">
            <h3 className="text-2xl font-bold mb-4">🚀 Demo Mode</h3>
            <p className="text-lg mb-4">
              This is a fully functional demo of the SLERF Earning Game. All features work including:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Demo wallet connection</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Playable cartoon game</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Score tracking & leaderboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Token earning simulation</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
