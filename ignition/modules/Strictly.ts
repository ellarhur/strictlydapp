import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

export default buildModule("StrictlyModule", (m) => {
  // Sätt månadsavgiften till 0.01 ETH (du kan ändra detta)
  const monthlyFee = m.getParameter("monthlyFee", parseEther("0.01"));

  const strictly = m.contract("Strictly", [monthlyFee]);

  return { strictly };
});
