import { useAccount } from "wagmi";

import "./Home.css";
import Connector from "./components/Connector";
import MainConnected from "./components/MainConnected";
import Menu from "./components/Menu";
import { createTheme, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { getGameEngine } from "./game/gameEngine";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const Home = () => {
  const { isConnected } = useAccount();

  useEffect(() => {
    getGameEngine().game.party = isConnected;
  }, [isConnected]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="ui-wrapper">
        <div className="topish">
          {isConnected ? <MainConnected /> : <Connector />}
        </div>
      </div>
      <Menu />
    </ThemeProvider>
  );
};

export default Home;
