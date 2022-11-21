import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
const ThirdwebConnect = () => {
  const address = useAddress();
  return (
    <div className="container">
      <h1>ThirdWeb Button</h1>
      <ConnectWallet />
      <h2>
        Address:<b> {address}</b>
      </h2>
    </div>
  );
};
export default ThirdwebConnect;