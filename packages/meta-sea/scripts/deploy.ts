import { ethers } from "hardhat";
import {writeFile} from "fs"

async function main() {
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();

  await nftMarketplace.deployed();
  console.log('nftMarketplace deployed to: ', nftMarketplace.address);
  
  writeFile('./config.js', `export const marketplaceAddress = ${nftMarketplace.address}`, (err) => {
    if(err) {
      console.error(err);
    }
  });
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
