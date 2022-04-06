const Web3 = require('web3')
const rpcURL = 'https://mainnet.infura.io/v3/89ed9464a5894869a1ae6c9ba59996fa' // Your RPC URL goes here
const web3 = new Web3(rpcURL)
const address = '0x0af5035a8dff53f5a89bfc083fdec94c7332ad7a' // Your account address goes here
web3.eth.getBalance(address, (err, wei) => {
  const balance = web3.utils.fromWei(wei, 'ether')
  console.log('balance: ', balance);

})