import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import ThirdwebConnect from './ThirdwebConnect';
import './App.css'
import OpenMyWallet from './OpenMyWallet';

function App() {
  return (
    <ThirdwebProvider
      desiredChainId={ChainId.Mainnet}
    >
      {/* <ThirdwebConnect /> */}
      <OpenMyWallet />
    </ThirdwebProvider>
  )
}

export default App
