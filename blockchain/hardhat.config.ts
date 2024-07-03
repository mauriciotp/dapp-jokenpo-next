import { HardhatUserConfig, vars } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

const INFURA_URL = vars.get('INFURA_URL')
const SECRET = vars.get('SECRET')
const API_KEY = vars.get('API_KEY')

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  defaultNetwork: 'local',
  networks: {
    local: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
      },
    },
    sepolia: {
      url: INFURA_URL,
      chainId: 11155111,
      accounts: {
        mnemonic: SECRET,
      },
    },
  },
  etherscan: {
    apiKey: API_KEY,
  },
}

export default config
