import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Web3Modal from 'web3modal';

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';
import { marketplaceAddress } from './config';

const client = create({ url: "http://127.0.0.1:5002/api/v0" })

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState('')
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const file = e.target.files[0]

    try {
      const added = await client.add(
        file,
        {
          progress: (prog: number) => console.log(`received: ${prog}`)
        }
      )
      console.log('added', added);

      const url = `http://localhost:9090/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function uploadToIPFS() {
    const { name, price, description } = formInput

    if (!name || !description || !price || !fileUrl) return

    const data = JSON.stringify({ name, description, image: fileUrl })

    try {
      const added = await client.add(data)
      const url = `http://localhost:9090/ipfs/${added.path}`
      return url
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS()

    // use my own wallet
    // const provider = await window.getProvider()
    // const pp = ethers.getDefaultProvider('goerli')
    // console.log('pp', pp);
    // const p = new ethers.providers.Web3Provider(provider)
    // console.log('kkkk', p);

    const web3Modal = new Web3Modal({})
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const nonce = await signer.getTransactionCount()
    console.log('create-nft-72', nonce)
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, price, { value: listingPrice })
    await transaction.wait()

    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder='Asset name'
          onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
          type="text" className="mt-8 border rounded p-4" />
        <textarea
          placeholder='Asset description'
          onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
          className="mt-2 border p-4"></textarea>
        <input
          placeholder='Asset price in Eth'
          onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
          type="text" className="mt-8 border rounded p-2" />
        <input type="file" name='Asset' onChange={onChange} className="my-4" />
        {
          fileUrl && (
            <img src={fileUrl} alt="file url" className="rounded" />
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">Create NFT</button>
      </div>
    </div>
  )

}