import { Text } from "@0xsequence/design-system";
import { Address } from "viem";

const MainConnected = (props: { walletAddress: Address | null }) => {
  const { walletAddress } = props;
  return (
    <>
      <Text
        variant="large"
        fontWeight="bold"
        color="text100"
        wordBreak="break-word"
      >
        Connected with address: {walletAddress}
      </Text>
    </>
  );
};

export default MainConnected;
