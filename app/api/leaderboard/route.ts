import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
const leaderboardData = [
  {
    address: "0x1234567890123456789012345678901234567890",
    score: 15420,
    tokensEarned: 1542.0,
    gamesPlayed: 45,
    lastPlayed: "2024-01-15T10:30:00Z",
  },
  // Add more mock data as needed
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const timeFilter = searchParams.get("timeFilter") || "all"
  const limit = Number.parseInt(searchParams.get("limit") || "50")

  try {
    // In production, filter by timeFilter and apply proper database queries
    const sortedData = leaderboardData
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }))

    return NextResponse.json({
      success: true,
      data: sortedData,
      total: leaderboardData.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { address, score, tokensEarned, gamesPlayed } = await request.json()

    // Validate input
    if (!address || typeof score !== "number" || typeof tokensEarned !== "number") {
      return NextResponse.json({ success: false, error: "Invalid input data" }, { status: 400 })
    }

    // Find existing entry or create new one
    const existingIndex = leaderboardData.findIndex((entry) => entry.address === address)

    if (existingIndex >= 0) {
      // Update existing entry if new score is higher
      if (score > leaderboardData[existingIndex].score) {
        leaderboardData[existingIndex] = {
          address,
          score,
          tokensEarned,
          gamesPlayed: leaderboardData[existingIndex].gamesPlayed + 1,
          lastPlayed: new Date().toISOString(),
        }
      }
    } else {
      // Add new entry
      leaderboardData.push({
        address,
        score,
        tokensEarned,
        gamesPlayed: gamesPlayed || 1,
        lastPlayed: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update leaderboard" }, { status: 500 })
  }
}
