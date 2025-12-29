#!/bin/bash
# Deploy script for Base Sepolia

# Load environment variables from .env
set -a
source .env
set +a

# Deploy the contract
npx hardhat run scripts/deploy.js --network baseSepolia
