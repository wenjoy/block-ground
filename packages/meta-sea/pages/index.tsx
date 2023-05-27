import axios from 'axios'
import { ethers } from 'ethers'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import { marketplaceAddress } from './config'

const Home: NextPage = () => {
  const [nfts, setNfts] = useState<any[]>([])
  const [loadingState, setLoadingState] = useState('not-loading')
  console.log('index-13-nfts', nfts)

  useEffect(() => {
    loadNFTs()
  }, [])

  // async function testProvider() {
  //   try {
  //     const p = window.getProvider()
  //     const provider = new ethers.providers.Web3Provider(p)

  //     const signer = provider.getSigner()
  //     const price = ethers.utils.parseUnits('1', 'ether')
  //     console.log('index-24', price)
  //     let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
  //     console.log('index-26-contract', contract)
  //     let listingPrice = await contract.getListingPrice()
  //     console.log('index-28', listingPrice)

  //     listingPrice = listingPrice.toString()
  //     const url = 'http://image.com'
  //     let transaction = await contract.createToken(url, price, { value: listingPrice })
  //     console.log('index-33-transaction', transaction)
  //     const result = await transaction.wait()
  //     console.log('index-36-result', result)
  //   } catch (err) {
  //     console.error('Test error: ', err);

  //   }
  // }

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()

    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchMarketItems()
    console.log('index-49-data', data)

    const items = await Promise.all(data.map(async (item: any) => {
      const tokenUri = await contract.tokenURI(item.tokenId)
      console.log('index-52-tokenUri', tokenUri)

      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(item.price.toString(), 'ether')
      return {
        price,
        tokenId: item.tokenId.toNumber(),
        seller: item.seller,
        owner: item.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description
      }
    }))

    setNfts(items)
    setLoadingState('loaded')
  }

  async function buyNFT(nft: any) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nft.tokenId, { value: price })
    await transaction.wait()
    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) return (
    <h1 className='px-20 py-10 text-3xl'>No items in marketplace</h1>
  )

  return (
    <div className='flex justify-start'>
      <div className='px-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
          {
            nfts.map((nft: any, i: number) => (
              <div className='border shadow rounded-xl overflow-hidden h-96 flex flex-col justify-between' key={i}>
                <img className='h-44' src={nft.image} alt="image" />
                <div className="p-4">
                  <p className="text-2xl font-semibold">{nft.name}</p>
                  <div className='h-70 overflow-hidden'>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">{nft.price} ETH</p>
                  <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNFT(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Home
