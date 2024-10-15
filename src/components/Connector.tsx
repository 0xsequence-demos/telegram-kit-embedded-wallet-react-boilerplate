import { useOpenConnectModal } from "@0xsequence/kit";

const Connector = () => {
  const { setOpenConnectModal } = useOpenConnectModal();

  return (
    <div>
      <button onClick={() => setOpenConnectModal(true)}>Connect</button>
    </div>
  );
};

export default Connector;
