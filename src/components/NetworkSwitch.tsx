import {
  Box,
  Text,
  Select,
  TokenImage,
  Spinner,
} from "@0xsequence/design-system";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NetworkList, Network } from "@0xsequence/waas";
import { sequence } from "../sequence";
import { networkImages } from "../utils/networkAssets";

export function NetworkSwitch(props: {
  network: Network | null;
  setNetwork: Dispatch<SetStateAction<Network | null>>;
}) {
  const { network, setNetwork } = props;

  const [networkList, setNetworkList] = useState<NetworkList>([]);

  useEffect(() => {
    sequence.networkList().then((networks: NetworkList) => {
      setNetworkList(networks);
      setNetwork(networks[0]);
    });
  }, []);

  if (networkList.length === 0) {
    return (
      <Box marginY="5">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box marginBottom="4">
      <Box marginBottom="4">
        <Text variant="normal" color="text100" fontWeight="bold">
          Network to use with requests:
        </Text>
      </Box>
      <Box>
        <Select
          name="chainId"
          labelLocation="top"
          onValueChange={(val) => {
            const selected = networkList?.find((chain) => chain.name === val);
            if (selected) {
              setNetwork(selected);
            }
          }}
          value={network?.name}
          options={[
            ...networkList.map((chain) => ({
              label: (
                <Box alignItems="center" gap="2">
                  <TokenImage src={networkImages[chain.id]} size="sm" />
                  <Text>{chain.name}</Text>
                </Box>
              ),
              value: String(chain.name),
            })),
          ]}
        />
      </Box>
    </Box>
  );
}
