import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { address, amount } = await request.json()

    // Simulate blockchain transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock transaction hash
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`

    return NextResponse.json({
      success: true,
      txHash,
      message: `Successfully claimed ${amount} SLERF tokens`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to claim tokens" }, { status: 500 })
  }
}
