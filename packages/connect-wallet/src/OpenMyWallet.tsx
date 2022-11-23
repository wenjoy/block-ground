import { useState } from 'react';

declare global {
  interface Window {
    openWallet: () => void;
  }
}

export default function OpenMyWallet() {
  const [account, setAccount] = useState()
  const openWallet = () => {
    console.log('test');
    window.openWallet();
  }

  const openMeta = async () => {
    if (ethereum) {
      console.log('sending request');
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log('debug', account);

      setAccount(account)
    } else {
      console.log('no ethereum: ', ethereum);
    }
  }

  return <div>
    <h1>Open my wallet</h1>
    <div>
      <section>
        <div>account: </div>
        <button onClick={openWallet}>Connect</button>
      </section>

      <section>
        <div>account: {account}</div>
        <button onClick={openMeta}>Metamask</button>
      </section>
    </div>
  </div>
}