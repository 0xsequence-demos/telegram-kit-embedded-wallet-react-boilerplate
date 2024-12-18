import {
  Box,
  Card,
  Collapsible,
  Spinner,
  Text,
  TextInput,
} from "@0xsequence/design-system";
import { ChangeEvent, useEffect, useState } from "react";
import { sequence } from "../sequence";
import { Network } from "@0xsequence/waas";

const TestSignMessage = (props: { network?: Network }) => {
  const [messageToSign, setMessageToSign] = useState<string>("");
  const [signature, setSignature] = useState<string>();
  const [textCopied, setTextCopied] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  const onChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMessageToSign(value);
  };

  const signMessage = async () => {
    setIsPending(true);
    const signature = await sequence.signMessage({
      message: messageToSign,
      network: props.network?.id,
    });

    setSignature(signature.data.signature);
  };

  const copySignature = () => {
    if (!signature) return;
    window.navigator.clipboard.writeText(signature);
    setTextCopied(true);
  };

  useEffect(() => {
    if (textCopied)
      setTimeout(() => {
        setTextCopied(false);
      }, 2000);
  }, [textCopied]);

  return (
    <>
      <Collapsible
        label="Sign Message"
        display="flex"
        flexDirection="column"
        gap="8"
      >
        <Box display="flex" flexDirection="column" gap="8" marginBottom="8">
          <TextInput
            name="Message"
            controls="Message"
            numeric={false}
            onChange={onChangeMessage}
          />
          <button
            onClick={signMessage}
            type="button"
            disabled={isPending}
            className="margin-left-auto"
          >
            Sign
          </button>
        </Box>
        <Card>
          {signature ? (
            <Box
              display="flex"
              flexDirection="column"
              gap="8"
              style={{ maxWidth: "700px" }}
            >
              <Text className="break-word">Signature: {signature}</Text>
              <button onClick={copySignature} className="margin-left-auto">
                {!textCopied ? "Copy" : "Copied"}
              </button>
            </Box>
          ) : (
            <Box>
              <Text>Nothing signed yet</Text>
            </Box>
          )}
          {isPending && (
            <Box gap="2" alignItems="center" marginTop="4">
              <Spinner size="sm" />
              <Text variant="small" color="text50">
                Pending...
              </Text>
            </Box>
          )}
        </Card>
      </Collapsible>
    </>
  );
};

export default TestSignMessage;
