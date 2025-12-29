import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const networkInfo = await ethers.provider.getNetwork();
  const hardhatNetworkName = network?.name || "unknown";

  console.log(`Deploying Strictly contract...`);
  console.log(`Hardhat network: ${hardhatNetworkName}`);
  console.log(`Chain: ${networkInfo.name} (chainId: ${networkInfo.chainId})`);

  const monthlyFeeEth = process.env.MONTHLY_FEE_ETH || "0.01";
  const monthlyFee = ethers.parseEther(monthlyFeeEth);
  if (monthlyFee <= 0n) {
    throw new Error(`MONTHLY_FEE_ETH must be > 0 (got "${monthlyFeeEth}")`);
  }
  
  console.log(`Monthly fee: ${monthlyFee.toString()} wei (${ethers.formatEther(monthlyFee)} ETH)`);

  const Strictly = await ethers.getContractFactory("Strictly");
  const strictly = await Strictly.deploy(monthlyFee);

  await strictly.waitForDeployment();

  const address = await strictly.getAddress();

  console.log(`Strictly deployed to: ${address}`);
  console.log(`Save this address for your frontend.`);
  
  console.log("\nWaiting for block confirmations...");
  await strictly.deploymentTransaction()?.wait(5);
  
  console.log("\nTo verify the contract, run:");
  console.log(`npx hardhat verify --network ${hardhatNetworkName} ${address} "${monthlyFee.toString()}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
