import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const namedAccounts = await getNamedAccounts();
  console.log('001_deploy_nft_market-9-namedAccounts', namedAccounts)
  const { deployer } = namedAccounts;
  console.log('deployer', deployer)

  await deploy('NFTMarketplace', {
    from: deployer,
    args: [],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });
};
export default func;
func.id = 'nft_marketplace';
func.tags = ['NFTMarketplace'];