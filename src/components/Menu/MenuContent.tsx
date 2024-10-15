import { TabbedNav } from "@0xsequence/design-system";
import MenuContentSettings from "./content/Settings";
import MenuContentInfo from "./content/Info";
import { useState } from "react";
import { Info, Settings } from "@mui/icons-material";

function MenuContent() {
  const [tab, setTab] = useState("info");
  return (
    <div>
      <TabbedNav
        className="menuTabs"
        defaultValue={tab}
        tabs={[
          {
            value: "info",
            label: "Info",
            leftIcon: Info,
          },
          {
            value: "settings",
            label: "Settings",
            leftIcon: Settings,
          },
        ]}
        onTabChange={(v: string) => setTab(v)}
      ></TabbedNav>
      {tab === "info" && <MenuContentInfo />}
      {tab === "settings" && <MenuContentSettings />}
    </div>
  );
}

export default MenuContent;
