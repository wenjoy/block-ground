
const BoredPetsNFT = artifacts.require('BoredPetsNFT');
const Marketplace = artifacts.require('Marketplace');

module.exports = async function(deployer) {
  await deployer.deploy(Marketplace);
  const marketplace = await Marketplace.deployed(); 
  await deployer.deploy(BoredPetsNFT, marketplace.address);
};
