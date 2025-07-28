"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSLERFContracts } from "@/hooks/use-slerf-contracts"
import { useAccount } from "wagmi"
import { WalletConnect } from "@/components/wallet-connect"
import { Play, Pause, RotateCcw, Home, Trophy, Coins } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface GameObject {
  x: number
  y: number
  width: number
  height: number
  type: "obstacle" | "coin"
}

export default function PlayPage() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { submitScore, isPending, isConfirmed, playerStats, refetchPlayerStats } = useSLERFContracts()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()

  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "gameOver">("menu")
  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(0)
  const [player, setPlayer] = useState({ x: 50, y: 200, velocityY: 0, isJumping: false })
  const [objects, setObjects] = useState<GameObject[]>([])
  const [gameSpeed, setGameSpeed] = useState(2)

  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 400
  const PLAYER_SIZE = 30
  const GRAVITY = 0.8
  const JUMP_FORCE = -15
  const GROUND_Y = CANVAS_HEIGHT - 50

  // Initialize game
  const initGame = useCallback(() => {
    setScore(0)
    setCoins(0)
    setPlayer({ x: 50, y: GROUND_Y - PLAYER_SIZE, velocityY: 0, isJumping: false })
    setObjects([])
    setGameSpeed(2)
  }, [])

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#1e1b4b"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw ground
    ctx.fillStyle = "#22c55e"
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 50)

    // Update player physics
    setPlayer((prev) => {
      let newY = prev.y + prev.velocityY
      let newVelocityY = prev.velocityY + GRAVITY
      let isJumping = prev.isJumping

      // Ground collision
      if (newY >= GROUND_Y - PLAYER_SIZE) {
        newY = GROUND_Y - PLAYER_SIZE
        newVelocityY = 0
        isJumping = false
      }

      return { ...prev, y: newY, velocityY: newVelocityY, isJumping }
    })

    // Draw player (simple rectangle for now)
    ctx.fillStyle = "#fbbf24"
    ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE)

    // Update and draw objects
    setObjects((prev) => {
      const updated = prev.map((obj) => ({ ...obj, x: obj.x - gameSpeed })).filter((obj) => obj.x + obj.width > 0)

      // Add new objects randomly
      if (Math.random() < 0.02) {
        const type = Math.random() < 0.7 ? "obstacle" : "coin"
        updated.push({
          x: CANVAS_WIDTH,
          y: type === "coin" ? GROUND_Y - 80 : GROUND_Y - 40,
          width: type === "coin" ? 20 : 30,
          height: type === "coin" ? 20 : 40,
          type,
        })
      }

      // Draw objects and check collisions
      updated.forEach((obj) => {
        if (obj.type === "obstacle") {
          ctx.fillStyle = "#ef4444"
        } else {
          ctx.fillStyle = "#fbbf24"
        }
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height)

        // Collision detection
        if (
          player.x < obj.x + obj.width &&
          player.x + PLAYER_SIZE > obj.x &&
          player.y < obj.y + obj.height &&
          player.y + PLAYER_SIZE > obj.y
        ) {
          if (obj.type === "obstacle") {
            setGameState("gameOver")
          } else if (obj.type === "coin") {
            setCoins((prev) => prev + 1)
            setScore((prev) => prev + 10)
            // Remove collected coin
            const index = updated.indexOf(obj)
            if (index > -1) updated.splice(index, 1)
          }
        }
      })

      return updated
    })

    // Update score and speed
    setScore((prev) => prev + 1)
    setGameSpeed((prev) => Math.min(prev + 0.001, 5))

    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, player, gameSpeed])

  // Handle jump
  const jump = useCallback(() => {
    if (gameState === "playing" && !player.isJumping) {
      setPlayer((prev) => ({
        ...prev,
        velocityY: JUMP_FORCE,
        isJumping: true,
      }))
    }
  }, [gameState, player.isJumping])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault()
        jump()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [jump])

  // Start game loop
  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState, gameLoop])

  // Handle game over
  const handleGameOver = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet to submit score")
      return
    }

    try {
      await submitScore(score)
      toast.success(`Score submitted! Earned ${(score * 0.1).toFixed(1)} SLERF tokens`)
      refetchPlayerStats()
    } catch (error) {
      toast.error("Failed to submit score")
      console.error(error)
    }
  }

  // Handle confirmed transaction
  useEffect(() => {
    if (isConfirmed) {
      toast.success("Score recorded on blockchain!")
    }
  }, [isConfirmed])

  const startGame = () => {
    initGame()
    setGameState("playing")
  }

  const pauseGame = () => {
    setGameState(gameState === "paused" ? "playing" : "paused")
  }

  const resetGame = () => {
    initGame()
    setGameState("menu")
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
          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">{score}</div>
                <div className="text-sm text-gray-400">Score</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{coins}</div>
                <div className="text-sm text-gray-400">Coins</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{(score * 0.1).toFixed(1)}</div>
                <div className="text-sm text-gray-400">SLERF Earned</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{playerStats?.highScore || 0}</div>
                <div className="text-sm text-gray-400">High Score</div>
              </CardContent>
            </Card>
          </div>

          {/* Game Canvas */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="w-full max-w-full border border-white/20 rounded-lg bg-gradient-to-b from-blue-400 to-blue-600"
                  onClick={jump}
                />

                {/* Game Overlays */}
                {gameState === "menu" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-white mb-4">SLERF Runner</h2>
                      <p className="text-gray-300 mb-6">Jump over obstacles and collect coins!</p>
                      <Button onClick={startGame} size="lg" className="bg-green-500 hover:bg-green-600">
                        <Play className="h-5 w-5 mr-2" />
                        Start Game
                      </Button>
                    </div>
                  </div>
                )}

                {gameState === "paused" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-white mb-4">Game Paused</h2>
                      <Button onClick={pauseGame} size="lg" className="bg-blue-500 hover:bg-blue-600">
                        <Play className="h-5 w-5 mr-2" />
                        Resume
                      </Button>
                    </div>
                  </div>
                )}

                {gameState === "gameOver" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-white mb-2">Game Over!</h2>
                      <p className="text-gray-300 mb-4">Final Score: {score}</p>
                      <p className="text-yellow-400 mb-6">Earned: {(score * 0.1).toFixed(1)} SLERF</p>
                      <div className="flex gap-4 justify-center">
                        {isConnected ? (
                          <Button
                            onClick={handleGameOver}
                            disabled={isPending}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Coins className="h-4 w-4 mr-2" />
                            {isPending ? "Submitting..." : "Submit Score"}
                          </Button>
                        ) : (
                          <div className="text-center">
                            <p className="text-yellow-400 mb-4">Connect wallet to submit score</p>
                            <WalletConnect />
                          </div>
                        )}
                        <Button
                          onClick={resetGame}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Play Again
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Game Controls */}
          <div className="flex justify-center gap-4 mb-6">
            {gameState === "playing" && (
              <Button onClick={pauseGame} className="bg-yellow-500 hover:bg-yellow-600">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            <Button
              onClick={resetGame}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Link href="/leaderboard">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
            </Link>
          </div>

          {/* Instructions */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">How to Play</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <h4 className="font-semibold text-white mb-2">Controls:</h4>
                  <ul className="space-y-1">
                    <li>• Press SPACE or ↑ to jump</li>
                    <li>• Click on the game area to jump</li>
                    <li>• Avoid red obstacles</li>
                    <li>• Collect yellow coins</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Scoring:</h4>
                  <ul className="space-y-1">
                    <li>• +1 point per frame survived</li>
                    <li>• +10 points per coin collected</li>
                    <li>• Earn 0.1 SLERF per point</li>
                    <li>• Submit score to claim tokens</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
