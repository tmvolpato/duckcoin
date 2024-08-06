import { ethers } from "hardhat";

async function main() {
    const duckcoin = await ethers.deployContract("DuckCoin");
    await duckcoin.waitForDeployment();

    console.log(`Contract deployed at ${duckcoin.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});