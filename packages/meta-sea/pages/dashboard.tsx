import axios from 'axios';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { marketplaceAddress } from './config';

export default function CreateDashboard() {
  const [nfts, setNfts] = useState<any[]>([])
  const [loadingState, setLoadingState] = useState('not-loading')

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    const data = await contract.fetchItemsListed()

    const items = await Promise.all(data.map(async (i: any) => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      return {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
    }))

    setNfts(items)
    setLoadingState('loading')
  }

  if (loadingState === 'loaded' && !nfts.length) return <h1 className='py-10 px-20 text-3xl'>No NFTs listed</h1>

  return (
    <div className='p-4'>
      <h2 className="text-2xl py-2">Items Listed</h2>
      {
        nfts.map((nft, i) => (
          <div className="border shadow rounded-xl overflow-hidden" key={i}>
            <img src={nft.image} alt='' className='rounded' />
            <div className="p-4 b-black">
              <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
            </div>
          </div>
        ))
      }
    </div>
  )
}