import { SequenceWaaS } from "@0xsequence/waas";

export const sequence = new SequenceWaaS({
  network: "polygon",
  projectAccessKey: import.meta.env.VITE_PROJECT_ACCESS_KEY,
  waasConfigKey: import.meta.env.VITE_WAAS_CONFIG_KEY,
});
