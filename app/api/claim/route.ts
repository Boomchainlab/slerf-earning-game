import { type NextRequest, NextResponse } from "next/server"

// Mock user claims database
const userClaims: { [address: string]: { totalClaimed: number; lastClaim: string; claims: any[] } } = {}

export async function POST(request: NextRequest) {
  try {
    const { address, amount } = await request.json()

    // Validate input
    if (!address || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ success: false, error: "Invalid claim data" }, { status: 400 })
    }

    // Initialize user claims if not exists
    if (!userClaims[address]) {
      userClaims[address] = {
        totalClaimed: 0,
        lastClaim: "",
        claims: [],
      }
    }

    // Simulate blockchain transaction
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`

    // Update user claims
    const claimRecord = {
      amount,
      timestamp: new Date().toISOString(),
      txHash,
      status: "completed",
    }

    userClaims[address].totalClaimed += amount
    userClaims[address].lastClaim = claimRecord.timestamp
    userClaims[address].claims.unshift(claimRecord)

    return NextResponse.json({
      success: true,
      txHash,
      claimRecord,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Claim failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ success: false, error: "Address required" }, { status: 400 })
  }

  const userClaimData = userClaims[address] || {
    totalClaimed: 0,
    lastClaim: "",
    claims: [],
  }

  return NextResponse.json({
    success: true,
    data: userClaimData,
  })
}
