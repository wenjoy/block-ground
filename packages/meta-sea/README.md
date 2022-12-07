# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

# How to start
1. start local block chain with `npx hardhat node`
2. deployt contract `npx hardhat run --network localhost scripts/deploy.ts`
3. start web server `npm run dev`
4. start ipfs service `jsipfs daemon`
5. open webui to check `https://webui.ipfs.io/#/`
the gateway is `http://localhost:9090`
6. import one of ten accounts given but hardhat into metamask
7. configure and change connected network to local hardhat 
8. create an nft at Shell NFT tab, and sign at metamask, because the NFT on store takes service charge

