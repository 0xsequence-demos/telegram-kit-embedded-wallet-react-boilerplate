import { useState } from "react";
import SettingsButton from "./Button";
import SettingsMenuContent from "./MenuContent";
import { getGameEngine } from "../../game/gameEngine";
import "./style.css";

function Menu() {
  const [open, setOpen] = useState(false);
  getGameEngine().renderer.domElement.className = open ? "blur" : "";
  return (
    <div className={`${open ? "settingsOpen" : "settingsClosed"} panel`}>
      <SettingsButton
        open={open}
        onClick={() => {
          setOpen(!open);
          getGameEngine().game.paused = !open;
        }}
      />
      {open ? <SettingsMenuContent /> : null}
    </div>
  );
}

export default Menu;
