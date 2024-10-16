import Home from "./Home";
import { SequenceKit } from "@0xsequence/kit";
import { config } from "./config";
import "@0xsequence/design-system/styles.css";

const App = () => {
  return (
    <SequenceKit config={config}>
      <Home />
    </SequenceKit>
  );
};

export default App;
