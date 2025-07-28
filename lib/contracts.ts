export const SLERF_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
] as const

export const SLERF_GAME_ABI = [
  "function submitScore(uint256 _score)",
  "function claimTokens()",
  "function getPlayerStats(address player) view returns (tuple(uint256 totalScore, uint256 gamesPlayed, uint256 tokensEarned, uint256 tokensClaimed, uint256 lastClaimTime, uint256 highScore))",
  "function getLeaderboard(uint256 limit) view returns (address[] players, uint256[] scores)",
  "function pendingTokens(address) view returns (uint256)",
  "function playerStats(address) view returns (tuple(uint256 totalScore, uint256 gamesPlayed, uint256 tokensEarned, uint256 tokensClaimed, uint256 lastClaimTime, uint256 highScore))",
  "event GamePlayed(address indexed player, uint256 score, uint256 tokensEarned)",
  "event TokensClaimed(address indexed player, uint256 amount)",
  "event LeaderboardUpdated(address indexed player, uint256 newHighScore)",
] as const

export const CONTRACT_ADDRESSES = {
  8453: {
    // Base Mainnet
    SLERF_TOKEN: process.env.NEXT_PUBLIC_SLERF_TOKEN_ADDRESS || "",
    SLERF_GAME: process.env.NEXT_PUBLIC_SLERF_GAME_ADDRESS || "",
  },
  84532: {
    // Base Sepolia
    SLERF_TOKEN: process.env.NEXT_PUBLIC_SLERF_TOKEN_ADDRESS || "",
    SLERF_GAME: process.env.NEXT_PUBLIC_SLERF_GAME_ADDRESS || "",
  },
  1337: {
    // Local Hardhat
    SLERF_TOKEN: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    SLERF_GAME: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
} as const
