"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useWallet } from "@/hooks/use-wallet"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WalletConnect } from "@/components/wallet-connect"
import { ArrowLeft, Pause, Play, RotateCcw } from "lucide-react"
import Link from "next/link"

interface GameObject {
  id: number
  x: number
  y: number
  type: "coin" | "obstacle" | "powerup"
  collected?: boolean
}

interface Player {
  x: number
  y: number
  velocityY: number
  isJumping: boolean
}

export default function PlayPage() {
  const { isConnected } = useWallet()
  const router = useRouter()
  const gameLoopRef = useRef<number>()
  const [showWalletModal, setShowWalletModal] = useState(false)

  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "gameOver">("menu")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [player, setPlayer] = useState<Player>({ x: 100, y: 300, velocityY: 0, isJumping: false })
  const [objects, setObjects] = useState<GameObject[]>([])
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({})

  // Show wallet modal if not connected
  useEffect(() => {
    if (!isConnected) {
      setShowWalletModal(true)
    }
  }, [isConnected])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: true }))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: false }))
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Game logic
  const jump = useCallback(() => {
    if (!player.isJumping) {
      setPlayer((prev) => ({ ...prev, velocityY: -15, isJumping: true }))
    }
  }, [player.isJumping])

  const spawnObject = useCallback(() => {
    const types: GameObject["type"][] = ["coin", "coin", "coin", "obstacle", "powerup"]
    const type = types[Math.floor(Math.random() * types.length)]

    const newObject: GameObject = {
      id: Date.now() + Math.random(),
      x: 800,
      y: type === "obstacle" ? 350 : Math.random() * 200 + 150,
      type,
      collected: false,
    }

    setObjects((prev) => [...prev, newObject])
  }, [])

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return

    const gameLoop = () => {
      // Update player physics
      setPlayer((prev) => {
        let newY = prev.y + prev.velocityY
        let newVelocityY = prev.velocityY + 0.8 // gravity
        let newIsJumping = prev.isJumping

        // Ground collision
        if (newY >= 300) {
          newY = 300
          newVelocityY = 0
          newIsJumping = false
        }

        // Handle jump input
        if ((keys[" "] || keys["arrowup"] || keys["w"]) && !prev.isJumping) {
          newVelocityY = -15
          newIsJumping = true
        }

        // Handle left/right movement
        let newX = prev.x
        if (keys["arrowleft"] || keys["a"]) {
          newX = Math.max(50, prev.x - 5)
        }
        if (keys["arrowright"] || keys["d"]) {
          newX = Math.min(750, prev.x + 5)
        }

        return {
          x: newX,
          y: newY,
          velocityY: newVelocityY,
          isJumping: newIsJumping,
        }
      })

      // Update objects
      setObjects((prev) => {
        return prev.map((obj) => ({ ...obj, x: obj.x - 5 })).filter((obj) => obj.x > -50)
      })

      // Check collisions
      setObjects((prev) => {
        let newScore = score
        return prev.map((obj) => {
          if (obj.collected) return obj

          const distance = Math.sqrt(Math.pow(player.x - obj.x, 2) + Math.pow(player.y - obj.y, 2))

          if (distance < 40) {
            if (obj.type === "coin") {
              newScore += 10
              setScore(newScore)
              return { ...obj, collected: true }
            } else if (obj.type === "powerup") {
              newScore += 50
              setScore(newScore)
              return { ...obj, collected: true }
            } else if (obj.type === "obstacle") {
              setGameState("gameOver")
              if (newScore > highScore) {
                setHighScore(newScore)
                localStorage.setItem("slerfHighScore", newScore.toString())
              }
            }
          }
          return obj
        })
      })

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState, keys, player.x, player.y, player.isJumping, score, highScore])

  // Spawn objects periodically
  useEffect(() => {
    if (gameState !== "playing") return

    const interval = setInterval(spawnObject, 2000)
    return () => clearInterval(interval)
  }, [gameState, spawnObject])

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("gameOver")
          if (score > highScore) {
            setHighScore(score)
            localStorage.setItem("slerfHighScore", score.toString())
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, score, highScore])

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("slerfHighScore")
    if (saved) {
      setHighScore(Number.parseInt(saved))
    }
  }, [])

  const startGame = () => {
    if (!isConnected) {
      setShowWalletModal(true)
      return
    }
    setGameState("playing")
    setScore(0)
    setTimeLeft(60)
    setPlayer({ x: 100, y: 300, velocityY: 0, isJumping: false })
    setObjects([])
  }

  const resetGame = () => {
    setGameState("menu")
    setScore(0)
    setTimeLeft(60)
    setPlayer({ x: 100, y: 300, velocityY: 0, isJumping: false })
    setObjects([])
  }

  const getObjectEmoji = (type: GameObject["type"]) => {
    switch (type) {
      case "coin":
        return "🪙"
      case "obstacle":
        return "🌵"
      case "powerup":
        return "⭐"
      default:
        return "❓"
    }
  }

  return (
    <div className="min-h-screen game-bg">
      {/* Wallet Modal */}
      {showWalletModal && !isConnected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Connect Wallet to Play</h2>
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
              You need to connect your wallet to play and earn SLERF tokens
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

        <div className="flex items-center space-x-6 text-white">
          <div className="text-center">
            <div className="text-sm opacity-80">Score</div>
            <div className="text-2xl font-bold">{score.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm opacity-80">High Score</div>
            <div className="text-xl font-bold text-yellow-300">{highScore.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-sm opacity-80">Time</div>
            <div className="text-xl font-bold">{timeLeft}s</div>
          </div>
        </div>

        <div className="flex space-x-2">
          {gameState === "playing" && (
            <Button onClick={() => setGameState("paused")} className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Pause className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={resetGame}
            variant="outline"
            className="bg-white/20 border-white text-white hover:bg-white/30"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Game Area */}
      <div className="container mx-auto px-6">
        <Card className="bg-gradient-to-b from-sky-400 to-green-400 border-0 cartoon-shadow">
          <CardContent className="p-0">
            <div className="relative w-full h-96 overflow-hidden rounded-lg">
              {/* Ground */}
              <div className="absolute bottom-0 w-full h-16 bg-green-600"></div>

              {/* Clouds */}
              <div className="absolute top-4 left-10 text-4xl opacity-70">☁️</div>
              <div className="absolute top-8 right-20 text-3xl opacity-50">☁️</div>
              <div className="absolute top-2 left-1/2 text-5xl opacity-60">☁️</div>

              {/* Player */}
              <motion.div
                className="absolute text-6xl z-10"
                style={{
                  left: player.x - 30,
                  top: player.y - 30,
                }}
                animate={{
                  rotate: player.isJumping ? -10 : 0,
                }}
              >
                🦥
              </motion.div>

              {/* Game Objects */}
              <AnimatePresence>
                {objects.map((obj) => (
                  <motion.div
                    key={obj.id}
                    className="absolute text-4xl z-5"
                    style={{
                      left: obj.x - 20,
                      top: obj.y - 20,
                    }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                      scale: obj.collected ? 0 : 1,
                      rotate: obj.collected ? 180 : 0,
                      y: obj.type === "coin" ? [0, -10, 0] : 0,
                    }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{
                      scale: { duration: 0.3 },
                      y: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                    }}
                  >
                    {getObjectEmoji(obj.type)}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Game State Overlays */}
              <AnimatePresence>
                {gameState === "menu" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                  >
                    <div className="text-center text-white">
                      <h2 className="text-4xl font-bold mb-4">SLERF Runner</h2>
                      <p className="text-lg mb-6">Collect coins and avoid obstacles!</p>
                      <p className="text-sm mb-6 opacity-80">Use SPACE/W/↑ to jump, A/D/←/→ to move</p>
                      <Button
                        onClick={startGame}
                        size="lg"
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-full cartoon-shadow"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        {isConnected ? "Start Game" : "Connect Wallet"}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {gameState === "paused" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                  >
                    <div className="text-center text-white">
                      <h2 className="text-3xl font-bold mb-6">Game Paused</h2>
                      <Button
                        onClick={() => setGameState("playing")}
                        size="lg"
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-full cartoon-shadow"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Resume
                      </Button>
                    </div>
                  </motion.div>
                )}

                {gameState === "gameOver" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-black/70 flex items-center justify-center"
                  >
                    <div className="text-center text-white bg-white/10 backdrop-blur-sm p-8 rounded-3xl cartoon-shadow">
                      <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
                      <div className="text-2xl mb-2">
                        Final Score: <span className="text-yellow-300 font-bold">{score.toLocaleString()}</span>
                      </div>
                      <div className="text-lg mb-6">
                        SLERF Earned: <span className="text-green-300 font-bold">{(score * 0.1).toFixed(1)}</span>
                      </div>
                      {score > highScore && <div className="text-yellow-300 text-lg mb-4">🎉 New High Score! 🎉</div>}
                      <div className="flex space-x-4 justify-center">
                        <Button
                          onClick={startGame}
                          size="lg"
                          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-full"
                        >
                          Play Again
                        </Button>
                        <Link href="/claim">
                          <Button
                            size="lg"
                            className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full"
                          >
                            Claim SLERF
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Controls */}
        <div className="mt-6 flex justify-center space-x-4 md:hidden">
          <Button
            onTouchStart={jump}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-full cartoon-shadow text-2xl"
          >
            Jump
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-white/80">
          <p className="text-sm">Desktop: Use SPACE/W/↑ to jump, A/D/←/→ to move | Mobile: Tap Jump button</p>
        </div>
      </div>
    </div>
  )
}
