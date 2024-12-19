import { Box, Text } from "@0xsequence/design-system";
import TestSignMessage from "./TestSignMessage";
import { Address } from "viem";
import { NetworkSwitch } from "./NetworkSwitch";
import { Dispatch, SetStateAction } from "react";
import { Network } from "@0xsequence/waas";

const ConnectedExtraTools = (props: {
  network: Network | null;
  setNetwork: Dispatch<SetStateAction<Network | null>>;
  walletAddress: Address;
}) => {
  const { network, setNetwork, walletAddress } = props;
  return (
    <>
      <Text
        variant="small"
        fontWeight="bold"
        color="text100"
        wordBreak="break-word"
      >
        Connected with address: {walletAddress}
      </Text>
      <NetworkSwitch network={network} setNetwork={setNetwork} />
      <Box display="flex" flexDirection="column" gap="4">
        <TestSignMessage />
      </Box>
    </>
  );
};

export default ConnectedExtraTools;
