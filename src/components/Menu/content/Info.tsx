import { Footer } from "../../Footer";
import ConnectedExtraTools from "../../ConnectedExtraTools";
import { Network } from "@0xsequence/waas";
import { Dispatch, SetStateAction } from "react";
import { Address } from "viem";

function MenuContentInfo(props: {
  network: Network | null;
  setNetwork: Dispatch<SetStateAction<Network | null>>;
  walletAddress: Address | null;
}) {
  const { walletAddress, network, setNetwork } = props;
  return (
    <div className="settingsMenuContent scroller">
      <br />
      <h2>Sequence.js Telegram demo</h2>
      <h3 className="homepage__marginBtNormal">Embedded Wallet</h3>
      {walletAddress && network && (
        <ConnectedExtraTools
          network={network}
          setNetwork={setNetwork}
          walletAddress={walletAddress}
        />
      )}
      <Footer />
    </div>
  );
}

export default MenuContentInfo;
