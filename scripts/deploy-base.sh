#!/bin/bash
# Deploy script för Base Sepolia

# Ladda environment variables från .env
set -a
source .env
set +a

# Deploya kontraktet
npx hardhat run scripts/deploy.js --network baseSepolia
