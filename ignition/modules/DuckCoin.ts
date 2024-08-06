import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DuckCoinModule = buildModule("DuckCoinModule", (m) => {
  const duckCoin = m.contract("DuckCoin");

  return { duckCoin };
});

export default DuckCoinModule;