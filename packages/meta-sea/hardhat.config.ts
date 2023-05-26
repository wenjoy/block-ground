import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig, task } from "hardhat/config";
import 'hardhat-gui';
import 'hardhat-deploy'

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  }
};

task('balance', 'Print an account balance')
  .addParam('account', 'The account\'s address')
  .setAction(async (taskArgs, hre) => {
    const balance = await hre.ethers.provider.getBalance(taskArgs.account);


    console.log('hardhat.config-20', hre.ethers.utils.formatEther(balance), 'ETH')
  })

export default config;
