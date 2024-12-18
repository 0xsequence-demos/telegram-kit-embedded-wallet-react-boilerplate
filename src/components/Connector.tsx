import { Dispatch, SetStateAction, useState } from "react";
import { sequence } from "../sequence";
import { randomName } from "../utils/randomName";
import { Address } from "viem";

const Connector = (props: {
  setWalletAddress: Dispatch<SetStateAction<Address | null>>;
}) => {
  const [connecting, setConnecting] = useState(false);
  const { setWalletAddress } = props;
  const handleGuestLogin = async () => {
    if (connecting) {
      return;
    }
    setConnecting(true);
    const signInResponse = await sequence.signIn({ guest: true }, randomName());
    console.log(`Wallet address: ${signInResponse.wallet}`);
    setWalletAddress(signInResponse.wallet as Address);
  };

  return (
    <div>
      <button
        className={connecting ? "pending" : ""}
        onClick={handleGuestLogin}
      >
        {connecting ? "Please wait..." : "New Guest Account"}
      </button>
    </div>
  );
};

export default Connector;
