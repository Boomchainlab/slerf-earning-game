"use client"

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { formatEther } from "viem"
import { CONTRACT_ADDRESSES, SLERF_TOKEN_ABI, SLERF_GAME_ABI } from "@/lib/contracts"
import { useChainId } from "wagmi"

export function useSLERFContracts() {
  const chainId = useChainId()
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Token contract reads
  const { data: tokenBalance } = useReadContract({
    address: addresses?.SLERF_TOKEN as `0x${string}`,
    abi: SLERF_TOKEN_ABI,
    functionName: "balanceOf",
    args: [],
  })

  const { data: tokenSymbol } = useReadContract({
    address: addresses?.SLERF_TOKEN as `0x${string}`,
    abi: SLERF_TOKEN_ABI,
    functionName: "symbol",
  })

  // Game contract reads
  const { data: playerStats, refetch: refetchPlayerStats } = useReadContract({
    address: addresses?.SLERF_GAME as `0x${string}`,
    abi: SLERF_GAME_ABI,
    functionName: "getPlayerStats",
    args: [],
  })

  const { data: pendingTokens, refetch: refetchPendingTokens } = useReadContract({
    address: addresses?.SLERF_GAME as `0x${string}`,
    abi: SLERF_GAME_ABI,
    functionName: "pendingTokens",
    args: [],
  })

  const { data: leaderboardData, refetch: refetchLeaderboard } = useReadContract({
    address: addresses?.SLERF_GAME as `0x${string}`,
    abi: SLERF_GAME_ABI,
    functionName: "getLeaderboard",
    args: [10n], // Top 10 players
  })

  // Contract writes
  const submitScore = async (score: number) => {
    if (!addresses?.SLERF_GAME) return

    writeContract({
      address: addresses.SLERF_GAME as `0x${string}`,
      abi: SLERF_GAME_ABI,
      functionName: "submitScore",
      args: [BigInt(score)],
    })
  }

  const claimTokens = async () => {
    if (!addresses?.SLERF_GAME) return

    writeContract({
      address: addresses.SLERF_GAME as `0x${string}`,
      abi: SLERF_GAME_ABI,
      functionName: "claimTokens",
    })
  }

  // Helper functions
  const formatTokenAmount = (amount: bigint | undefined) => {
    if (!amount) return "0"
    return formatEther(amount)
  }

  const getPlayerStatsFormatted = () => {
    if (!playerStats) return null

    return {
      totalScore: Number(playerStats[0]),
      gamesPlayed: Number(playerStats[1]),
      tokensEarned: formatTokenAmount(playerStats[2]),
      tokensClaimed: formatTokenAmount(playerStats[3]),
      lastClaimTime: Number(playerStats[4]),
      highScore: Number(playerStats[5]),
    }
  }

  const getLeaderboardFormatted = () => {
    if (!leaderboardData) return []

    const [players, scores] = leaderboardData
    return players.map((player, index) => ({
      address: player,
      score: Number(scores[index]),
      rank: index + 1,
    }))
  }

  return {
    // Contract addresses
    addresses,

    // Token data
    tokenBalance: formatTokenAmount(tokenBalance),
    tokenSymbol,

    // Player data
    playerStats: getPlayerStatsFormatted(),
    pendingTokens: formatTokenAmount(pendingTokens),
    leaderboard: getLeaderboardFormatted(),

    // Actions
    submitScore,
    claimTokens,

    // Transaction states
    isPending,
    isConfirming,
    isConfirmed,
    hash,

    // Refetch functions
    refetchPlayerStats,
    refetchPendingTokens,
    refetchLeaderboard,
  }
}
