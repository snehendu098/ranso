import { createx402Tool } from "./src";

createx402Tool(
  async (input: { name: string }) => {
    return { greeting: `Hello ${input.name}` };
  },
  {
    price: 0.02, // USDC
    devWallet: "0x419E5aD68d2Ff4d1786FE4bB7ebe7b3563A5A6d7",
    port: 8000,
  },
);
