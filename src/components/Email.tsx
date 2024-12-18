import { Text } from "@0xsequence/design-system";
import { useEmailAuth } from "../hooks/useEmailAuth";
import { randomName } from "../utils/randomName";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { PINCodeInput } from "./PinCodeInput";
import { AddLink, EmailOutlined } from "@mui/icons-material";
import { Account } from "@0xsequence/waas";
import { Address } from "viem";

export default function Email(props: {
  currentAccount: Account | null;
  refreshAccounts: () => Promise<void>;
  setAccountChangesPending: Dispatch<SetStateAction<boolean>>;
  setWalletAddress: Dispatch<SetStateAction<`0x${string}` | null>>;
}) {
  const {
    currentAccount,
    refreshAccounts,
    setWalletAddress,
    setAccountChangesPending,
  } = props;

  const [showEmailWarning, setEmailWarning] = useState(false);
  const [code, setCode] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isEmailValid = inputRef.current?.validity.valid;
  const [showCodeUI, setShowCodeUI] = useState(false);

  const {
    // inProgress: emailAuthInProgress,
    // loading: emailAuthLoading,
    initiateAuth: initiateEmailAuth,
    sendChallengeAnswer,
  } = useEmailAuth({
    sessionName: randomName(),
    onSuccess: async ({ wallet }) => {
      console.log(`Wallet address: ${wallet}`);
      refreshAccounts().then(() => {
        setWalletAddress(wallet as Address);
        setShowCodeUI(false);
      });
    },
    linkAccount: !!currentAccount,
  });

  useEffect(() => {
    if (sendChallengeAnswer) {
      return;
    }
    setBusy(false);
    setCode([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setEmail("");
  }, [sendChallengeAnswer]);

  useEffect(() => {
    if (!sendChallengeAnswer) {
      return;
    }
    setShowCodeUI(true);
  }, [sendChallengeAnswer]);

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          opacity: busy ? "60%" : "100%",
        }}
      >
        {showCodeUI ? (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <Text marginBottom="5" variant="normal" color="text80">
              Enter code received in email.
            </Text>
            <div
              style={{
                flex: "1",
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1" }}>
                <PINCodeInput value={code} digits={6} onChange={setCode} />
              </div>
              <button
                disabled={code.includes("")}
                onClick={() => {
                  if (sendChallengeAnswer) {
                    setAccountChangesPending(true);
                    setBusy(true);
                    sendChallengeAnswer(code.join("")).then(() => {
                      refreshAccounts().then(() => {
                        // setWalletAddress(wallet as Address);
                        setShowCodeUI(false);
                        setBusy(false);
                      });
                    });
                  }
                }}
                data-id="verifyButton"
                style={{ flex: "0 0 180px", position: "relative" }}
              >
                {busy ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <EmailOutlined style={{ transform: "translateY(12px)" }} />
            <input
              name="email"
              type="email"
              onChange={(ev: { target: { value: SetStateAction<string> } }) => {
                setEmail(ev.target.value);
              }}
              ref={inputRef}
              onKeyDown={(ev: { key: string }) => {
                if (email && ev.key === "Enter") {
                  initiateEmailAuth(email);
                }
              }}
              onBlur={() => setEmailWarning(!!email && !isEmailValid)}
              value={email}
              placeholder="hello@example.com"
              required
              data-id="loginEmail"
              style={{
                flex: "1",
                fontSize: "16px",
                margin: "4px",
                outlineWidth: "2px",
                outlineColor: "#ffffff",
                outlineStyle: "solid",
                borderRadius: "10px",
                borderStyle: "hidden",
                padding: "10px",
              }}
            />
            <button
              disabled={!isEmailValid}
              onClick={() => initiateEmailAuth(email)}
              data-id="continueButton"
              style={{ flex: "0 0 180px", position: "relative" }}
            >
              {currentAccount ? (
                <>
                  Add Email Login
                  <AddLink
                    style={{
                      position: "absolute",
                      right: "6px",
                      top: "8px",
                    }}
                  />
                </>
              ) : (
                "Login via Email"
              )}
            </button>
          </>
        )}
      </div>
      {showEmailWarning && (
        <Text as="p" variant="small" color="negative" marginY="2">
          Invalid email address
        </Text>
      )}
    </>
  );
}
