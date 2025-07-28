# SLERF Earning Game

A play-to-earn Web3 game built on Base blockchain where players can earn real SLERF tokens by playing a cartoon runner game.

## 🎮 Features

- **Play-to-Earn**: Earn 0.1 SLERF tokens per point scored
- **Real Blockchain Integration**: Smart contracts on Base network
- **Global Leaderboard**: Compete with players worldwide
- **Token Claiming**: Claim earned tokens directly to your wallet
- **Multiple Wallets**: Support for MetaMask, Coinbase Wallet, and WalletConnect

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- Base network added to your wallet

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-username/slerf-earning-game.git
cd slerf-earning-game
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your environment variables:
- `PRIVATE_KEY`: Your wallet private key for contract deployment
- `BASESCAN_API_KEY`: API key from BaseScan for contract verification
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Project ID from WalletConnect
- `NEXT_PUBLIC_SLERF_TOKEN_ADDRESS`: Deployed token contract address
- `NEXT_PUBLIC_SLERF_GAME_ADDRESS`: Deployed game contract address

### Smart Contract Deployment

1. Compile contracts:
\`\`\`bash
npm run compile
\`\`\`

2. Deploy to Base Sepolia (testnet):
\`\`\`bash
npm run deploy:sepolia
\`\`\`

3. Deploy to Base Mainnet:
\`\`\`bash
npm run deploy:base
\`\`\`

4. Update your `.env.local` with the deployed contract addresses.

### Running the Application

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the game.

## 🎯 How to Play

1. **Connect Wallet**: Connect your Web3 wallet to the game
2. **Play Game**: Navigate to the play page and start the runner game
3. **Earn Points**: Jump over obstacles and collect coins to score points
4. **Submit Score**: Submit your score to the blockchain to earn SLERF tokens
5. **Claim Tokens**: Visit the claim page to claim your earned tokens

## 📊 Game Mechanics

- **Scoring**: 1 point per frame survived + 10 points per coin collected
- **Token Earning**: 0.1 SLERF tokens per point scored
- **Claim Cooldown**: 1 hour between token claims
- **Max Score**: 10,000 points per game (anti-cheat measure)

## 🔧 Smart Contracts

### SLERFToken.sol
- ERC-20 token contract
- 1 billion max supply
- Minting controlled by game contract

### SLERFGame.sol
- Game logic and scoring
- Token reward distribution
- Leaderboard management
- Anti-cheat mechanisms

## 🌐 Supported Networks

- **Base Mainnet** (Chain ID: 8453)
- **Base Sepolia** (Chain ID: 84532) - Testnet
- **Local Hardhat** (Chain ID: 1337) - Development

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Web3**: Wagmi, Viem, WalletConnect
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **UI Components**: shadcn/ui, Radix UI
- **Blockchain**: Base (Ethereum L2)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you need help or have questions, please open an issue on GitHub or contact us through our community channels.
