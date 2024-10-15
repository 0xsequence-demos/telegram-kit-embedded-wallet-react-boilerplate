import { Text } from "@0xsequence/design-system";
import { useAccount } from "wagmi";
import Disconnector from "./Disconnector";
import { Missing } from "./Missing";

const MainConnected = () => {
  const { address, chain, chainId } = useAccount();
  if (!address) {
    return <Missing>an address</Missing>;
  }
  if (!chain) {
    return <Missing>a chain</Missing>;
  }
  if (!chainId) {
    return <Missing>a chainId</Missing>;
  }
  return (
    <>
      <Text
        variant="large"
        fontWeight="bold"
        color="text100"
        wordBreak="break-word"
      >
        Connected with address: {address}
      </Text>
      <Disconnector />
    </>
  );
};

export default MainConnected;
