import { useState } from 'react';

declare global {
  interface Window {
    openWallet: ({ origin }: { origin: string }) => Promise<any>;
  }
}

export default function OpenMyWallet() {
  const origin = location.origin
  const [account, setAccount] = useState<any>()
  const [address, setAddress] = useState<any>()

  const openWallet = async () => {
    try {
      const { account } = await window.openWallet({ origin });
      setAccount(account);
    } catch (err) {
      console.log('err', err);
    }
  }

  const openMeta = async () => {
    if (ethereum) {
      console.log('sending request');
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log('debug', account);

      setAddress(account)
    } else {
      console.log('no ethereum: ', ethereum);
    }
  }

  console.log('account', account);
  return <div>
    <h1>Open my wallet</h1>
    <div>
      <section>
        <h1>Account</h1>
        <div>
          <p>Account name: {account?.name}</p>
          <p>Account address: {account?.wallet?.address}</p>
        </div>
        <button onClick={openWallet}>Connect</button>
      </section>

      <section>
        <div>account: {address}</div>
        <button onClick={openMeta}>Metamask</button>
      </section>
    </div>
  </div>
}