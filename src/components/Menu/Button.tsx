interface SettingsButtonProps {
  open: boolean;
  onClick: () => void;
}

function cn(open: boolean, num: number) {
  return `burgerXDash bd${num} ${open ? "open" : ""}`;
}

function SettingsButton(props: SettingsButtonProps) {
  return (
    <div className="settings button" onClick={props.onClick}>
      <div className={cn(props.open, 1)} />
      <div className={cn(props.open, 2)} />
      <div className={cn(props.open, 3)} />
    </div>
  );
}

export default SettingsButton;
