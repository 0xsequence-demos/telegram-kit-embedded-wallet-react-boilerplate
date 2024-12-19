import { Dispatch, SetStateAction, useState } from "react";
import SettingsButton from "./Button";
import MenuContent from "./MenuContent";
import { getGameEngine } from "../../game/gameEngine";
import "./style.css";
import { Account, Network } from "@0xsequence/waas";
import { Address } from "viem";

function Menu(props: {
  currentAccount: Account | null;
  setCurrentAccount: Dispatch<SetStateAction<Account | null>>;
  accounts: Account[];
  setAccounts: Dispatch<SetStateAction<Account[]>>;
  walletAddress: Address | null;
  setWalletAddress: Dispatch<SetStateAction<Address | null>>;
  accountChangesPending: boolean;
  setAccountChangesPending: Dispatch<SetStateAction<boolean>>;
  accountError: string | null;
  network: Network | null;
  setNetwork: Dispatch<SetStateAction<Network | null>>;
  removeAccount: (id: string) => Promise<void>;
  refreshAccounts: () => Promise<void>;
  loggingOut: boolean;
  setLoggingOut: Dispatch<SetStateAction<boolean>>;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    network,
    setNetwork,
    walletAddress,
    accountChangesPending,
    setAccountChangesPending,
    accounts,
    setAccounts,
    currentAccount,
    accountError,
    removeAccount,
    setWalletAddress,
    loggingOut,
    setCurrentAccount,
    setLoggingOut,
    refreshAccounts,
    menuOpen,
    setMenuOpen,
  } = props;
  const [tab, setTab] = useState("accounts");
  getGameEngine().renderer.domElement.className = menuOpen ? "blur" : "";
  return (
    <div className={`${menuOpen ? "settingsOpen" : "settingsClosed"} panel`}>
      <SettingsButton
        open={menuOpen}
        onClick={() => {
          setMenuOpen(!menuOpen);
        }}
      />
      {menuOpen ? (
        <MenuContent
          network={network}
          walletAddress={walletAddress}
          setNetwork={setNetwork}
          tab={tab}
          setTab={setTab}
          accounts={accounts}
          setAccounts={setAccounts}
          currentAccount={currentAccount}
          accountError={accountError}
          accountChangesPending={accountChangesPending}
          setAccountChangesPending={setAccountChangesPending}
          removeAccount={removeAccount}
          setWalletAddress={setWalletAddress}
          setCurrentAccount={setCurrentAccount}
          loggingOut={loggingOut}
          setLoggingOut={setLoggingOut}
          refreshAccounts={refreshAccounts}
        />
      ) : null}
    </div>
  );
}

export default Menu;
