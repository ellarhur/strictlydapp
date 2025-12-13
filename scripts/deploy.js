import hre from "hardhat";
import { parseEther } from "ethers";

async function main() {
  console.log("Deploying Strictly contract to Base Sepolia...");

  // Sätt månadsavgiften (0.01 ETH som exempel)
  const monthlyFee = parseEther("0.01");
  
  console.log(`Monthly fee: ${monthlyFee.toString()} wei (${hre.ethers.formatEther(monthlyFee)} ETH)`);

  const Strictly = await hre.ethers.getContractFactory("Strictly");
  const strictly = await Strictly.deploy(monthlyFee);

  await strictly.waitForDeployment();

  const address = await strictly.getAddress();

  console.log(`✅ Strictly deployed to: ${address}`);
  console.log(`📝 Save this address for your frontend!`);
  
  // Visa nätverksinformation
  const network = await hre.ethers.provider.getNetwork();
  console.log(`Network: ${network.name} (chainId: ${network.chainId})`);
  
  // Vänta lite innan verifiering
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
