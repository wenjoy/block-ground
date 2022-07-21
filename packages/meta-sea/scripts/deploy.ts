import { ethers } from "hardhat";

async function main() {
  const Lock = await ethers.getContractFactory("NFTMarketplace");
  const lock = await Lock.deploy();

  await lock.deployed();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
