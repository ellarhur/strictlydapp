import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "ethers";

export default buildModule("StrictlyModule", (m) => {
  // Set the monthly fee to 0.01 ETH (you can change this)
  const monthlyFee = m.getParameter("monthlyFee", parseEther("0.01"));

  const strictly = m.contract("Strictly", [monthlyFee]);

  return { strictly };
});
