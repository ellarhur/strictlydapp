# Strictly - Support your favorite artists directly.

A decentralized music streaming platform prototype enabling automatic, transparent, and direct royalty payments to creators.

## Project Overview

Strictly is a six-week thesis project that demonstrates how blockchain technology can address challenges faced by independent artists on existing streaming platforms. Instead of relying on third-party distributors that take a significant cut of streaming revenue, Strictly allows creators to publish their work and receive direct payments through digital wallets, while offering fans a transparent way to support their favorite artists.


## How It Works

1. A user opens the dApp and **connects their wallet**
2. They choose between **listener** or **artist** mode
3. **Listeners** can:
   - Browse the latest uploaded tracks
   - Subscribe by paying a monthly fee on-chain
   - Play tracks (each play is recorded on the blockchain)
   - View their "Wrapped" stats showing listening breakdown
4. **Artists** can:
   - Upload track metadata (title, artist, album, genre, cover image, royalty wallet address)
   - View their published tracks
5. **At period end**, the smart contract automatically distributes each listener's subscription proportionally to the artists they listened to, based on play counts

## Getting Started

Before you begin, make sure you have:
- **Node.js** (v16 or higher) and **npm** installed
- A **Web3 wallet** browser extension (e.g., [MetaMask](https://metamask.io/))
- Some **testnet ETH** (e.g., Sepolia ETH from a faucet)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ellarhur/strictlydapp.git
   cd strictlydapp
   ```

2. **Install dependencies**
   
   For the smart contracts:
   ```bash
   npm install
   ```
   
   For the frontend:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Configuration


The Strictly dApp comes pre-configured with a deployed smart contract on **Ethereum Sepolia testnet**.

**Default Contract Address:** `0xED11ACa1512Abd30b3b2f8a258d642fe6756F570`  
**Network:** Ethereum Sepolia (Chain ID: 11155111)

You can start using the app immediately without any additional configuration.

## Custom Configuration (Optional)

If you want to use your own deployed contract, create a `frontend/.env.local` file with:

```
VITE_STRICTLY_CONTRACT_ADDRESS=0x_your_deployed_contract_address
VITE_NETWORK_CHAIN_ID=11155111
VITE_NETWORK_NAME=Ethereum Sepolia
```

### Running the Application

1. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open your browser** and navigate to `http://localhost:5173` (or the URL shown in your terminal)

3. **Connect your wallet** when prompted

4. **Switch to the correct network** in MetaMask (Ethereum Sepolia testnet)

5. **Get testnet ETH** if you don't have any:
   - [Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

## Project Structure

```
strictlydapp/
├── contracts/              # Solidity smart contracts
│   └── Strictly.sol
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts (wallet, tracks)
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
├── scripts/              # Deployment scripts
├── ignition/             # Hardhat Ignition modules
└── README.md
```

## Known Limitations

- **User Experience**: Users must sign a transaction for every play, which can be tiresome
- **No Real Audio**: Tracks are mocked; actual audio streaming is not implemented
- **Single Payout Address**: Multi-address royalty splits not yet supported
- **Legal Compliance**: KYC/AML and rights verification are not production-ready
- **Scalability**: The current model has not been tested at scale

## Reflections

This prototype validates the feasibility of transparent, on-chain royalty distribution for music streaming. It demonstrates that automatic, proportional payouts to creators can be achieved, though significant work remains to make the user experience seamless and the platform production-ready.

The biggest challenge is balancing simplicity for users with accurate royalty distribution, while maintaining financial sustainability if fairness to creators is the primary incentive.

**Support your favorite artists directly.**

