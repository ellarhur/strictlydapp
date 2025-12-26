import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  console.log("Deploying Strictly contract to Base Sepolia...");

  const monthlyFee = ethers.parseEther("0.01");
  
  console.log(`Monthly fee: ${monthlyFee.toString()} wei (${ethers.formatEther(monthlyFee)} ETH)`);

  const Strictly = await ethers.getContractFactory("Strictly");
  const strictly = await Strictly.deploy(monthlyFee);

  await strictly.waitForDeployment();

  const address = await strictly.getAddress();

  console.log(`✅ Strictly deployed to: ${address}`);
  console.log(`📝 Save this address for your frontend!`);
  
  const networkInfo = await ethers.provider.getNetwork();
  console.log(`Network: ${networkInfo.name} (chainId: ${networkInfo.chainId})`);
  
  console.log("\nWaiting for block confirmations...");
  await strictly.deploymentTransaction()?.wait(5);
  
  console.log("\n🔍 To verify the contract, run:");
  console.log(`npx hardhat verify --network baseSepolia ${address} "${monthlyFee.toString()}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
