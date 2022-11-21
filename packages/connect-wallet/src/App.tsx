import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import ThirdwebConnect from './ThirdwebConnect';
import './App.css'

function App() {
  return (
    <ThirdwebProvider
      desiredChainId={ChainId.Mainnet}
    >
      <ThirdwebConnect />
    </ThirdwebProvider>
  )
}

export default App
