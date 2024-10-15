import { Footer } from "../../Footer";
import ConnectedExtraTools from "../../ConnectedExtraTools";
import { useAccount } from "wagmi";
import Connector from "../../Connector";

function MenuContentInfo() {
  const { isConnected } = useAccount();
  return (
    <div className="settingsMenuContent scroller">
      <br />
      <h2>Sequence Kit Starter - React</h2>
      <h3 className="homepage__marginBtNormal">Embedded Wallet</h3>
      {isConnected ? <ConnectedExtraTools /> : <Connector />}
      <Footer />
    </div>
  );
}

export default MenuContentInfo;
