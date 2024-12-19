import { Box, Text } from "@0xsequence/design-system";
import { Address } from "viem";
import { AccountName } from "../../../AccountName";
import { Account, IdentityType } from "@0xsequence/waas";
import Email from "../../Email";
import { Dispatch, SetStateAction, useState } from "react";
import { sequence } from "../../../sequence";
import { getMessageFromUnknownError } from "../../../utils/getMessageFromUnknownError";
import {
  EmailOutlined,
  LinkOff,
  Logout,
  PersonOutline,
  ReportProblem,
  Wallet,
} from "@mui/icons-material";
import { randomName } from "../../../utils/randomName";

function MenuContentAccounts(props: {
  walletAddress: Address | null;
  setWalletAddress: Dispatch<SetStateAction<Address | null>>;
  accounts: Account[];
  setAccounts: Dispatch<SetStateAction<Account[]>>;
  currentAccount: Account | null;
  setCurrentAccount: Dispatch<SetStateAction<Account | null>>;
  accountError: string | null;
  accountChangesPending: boolean;
  setAccountChangesPending: Dispatch<SetStateAction<boolean>>;
  removeAccount: (id: string) => Promise<void>;
  loggingOut: boolean;
  refreshAccounts: () => Promise<void>;
  setLoggingOut: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    walletAddress,
    currentAccount,
    accounts,
    setAccounts,
    accountError,
    removeAccount,
    accountChangesPending,
    setAccountChangesPending,
    loggingOut,
    setLoggingOut,
    setCurrentAccount,
    setWalletAddress,
    refreshAccounts,
  } = props;

  const [accountsUnlinking, setAccountsUnlinking] = useState<string[]>([]);

  return (
    <div className="settingsMenuContent scroller">
      <h3>
        <Wallet style={{ transform: "translateY(6px)" }} />{" "}
        {walletAddress || "Log in for wallet address"}
      </h3>
      <br />
      {currentAccount && (
        <Box flexDirection="row" gap="2" style={{ width: "100%" }}>
          <div
            style={{
              flex: "0 0 30px",
              textAlign: "left",
            }}
          >
            {currentAccount.type === IdentityType.Guest ? (
              <>
                <PersonOutline style={{ transform: "translateY(6px)" }} />
              </>
            ) : (
              <>
                <EmailOutlined style={{ transform: "translateY(6px)" }} />
              </>
            )}{" "}
          </div>
          <div
            style={{
              flex: "1",
              textAlign: "left",
              lineHeight: "40px",
              fontWeight: "bold",
            }}
          >
            <AccountName acc={currentAccount} />
          </div>
          <button
            className={loggingOut ? "pending" : ""}
            style={{
              flex: "0 0 180px",
              position: "relative",
            }}
            onClick={() => {
              if (loggingOut) {
                return;
              }
              setLoggingOut(true);
              sequence
                .dropSession({ strict: false })
                .catch((e: unknown) => {
                  console.warn(
                    `Could not drop session: ${getMessageFromUnknownError(e)}`,
                  );
                  setLoggingOut(false);
                })
                .finally(() => {
                  setCurrentAccount(null);
                  setAccounts([]);
                  setWalletAddress(null);
                  setLoggingOut(false);
                });
            }}
          >
            {loggingOut ? (
              "Logging Out..."
            ) : (
              <>
                Log Out
                <Logout
                  style={{
                    position: "absolute",
                    transform: "translateY(6px)",
                    right: "4px",
                    top: "0px",
                  }}
                />
              </>
            )}
          </button>
        </Box>
      )}
      <Box marginBottom="5" flexDirection="column">
        {accounts.length === 0 && (
          <button
            className={loggingOut ? "pending" : ""}
            onClick={() => {
              if (loggingOut || accountChangesPending) {
                return;
              }
              setAccountChangesPending(true);
              sequence
                .signIn({ guest: true }, randomName())
                .then((signInResponse) => {
                  setAccountChangesPending(false);
                  console.log(`Wallet address: ${signInResponse.wallet}`);
                  setWalletAddress(signInResponse.wallet as Address);
                });
            }}
          >
            {accountChangesPending ? "logging in" : "Log in as Guest"}
          </button>
        )}
        {accounts && (
          <>
            {accounts
              .filter((a) => a.id !== currentAccount?.id)
              .map((a) => (
                <Box
                  key={a.id}
                  flexDirection="row"
                  alignItems="center"
                  gap="2"
                  className={accountsUnlinking.includes(a.id) ? "pending" : "'"}
                >
                  <div style={{ flex: "0 0 20px" }}>
                    <PersonOutline style={{ transform: "translateY(6px)" }} />
                  </div>
                  <div style={{ flex: "1", textAlign: "left" }}>
                    <AccountName acc={a} />
                  </div>
                  {a.id !== currentAccount?.id && (
                    <button
                      onClick={() => {
                        if (accountsUnlinking.includes(a.id)) {
                          return;
                        }
                        setAccountsUnlinking(accountsUnlinking.concat(a.id));
                        removeAccount(a.id).then(() => {
                          setAccountsUnlinking(
                            accountsUnlinking.filter((id) => id !== a.id),
                          );
                        });
                      }}
                      style={{ flex: "0 0 180px", position: "relative" }}
                    >
                      {a.type === IdentityType.Guest ? (
                        <ReportProblem
                          style={{
                            position: "absolute",
                            left: "10px",
                            top: "8px",
                          }}
                        />
                      ) : null}
                      {accountsUnlinking.includes(a.id) ? "Removing" : "Remove"}
                      <LinkOff
                        style={{
                          position: "absolute",
                          right: "6px",
                          top: "8px",
                        }}
                      />
                    </button>
                  )}
                  {a.id === currentAccount?.id && (
                    <Box>
                      <Text variant="small" color="text100">
                        (Account you logged in with)
                      </Text>
                    </Box>
                  )}
                </Box>
              ))}
          </>
        )}
        {accountError && (
          <Text variant="normal" color="text100" fontWeight="bold">
            Error loading accounts: {accountError}
          </Text>
        )}
      </Box>
      <Email
        currentAccount={currentAccount}
        refreshAccounts={refreshAccounts}
        setWalletAddress={setWalletAddress}
        setAccountChangesPending={setAccountChangesPending}
      />
    </div>
  );
}

export default MenuContentAccounts;
