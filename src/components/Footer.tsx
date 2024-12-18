import { Text } from "@0xsequence/design-system";

export const Footer = () => {
  return (
    <div className="homepage__footer">
      <Text>
        Want to learn more? Read the{" "}
        <a
          href={"https://docs.sequence.xyz/"}
          target="_blank"
          rel="noreferrer "
        >
          docs
        </a>
        !
      </Text>
    </div>
  );
};
