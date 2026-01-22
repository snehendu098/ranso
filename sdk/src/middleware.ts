import type { Context, Next } from "hono";
import type { X402Config } from "./types";
import { facilitator, verify, settle } from "./facilitator";

export function x402Middleware(config: X402Config) {
  // Convert human-readable price to base units (USDC has 6 decimals)
  const priceInBaseUnits = Math.round(config.price * 1_000_000).toString();

  const requirements = facilitator.generatePaymentRequirements({
    payTo: config.devWallet,
    description: config.description || "Tool access",
    maxAmountRequired: priceInBaseUnits,
  });

  return async (c: Context, next: Next) => {
    const payment = c.req.header("X-PAYMENT");

    if (!payment) {
      const encoded = Buffer.from(JSON.stringify(requirements)).toString("base64");
      c.header("X-PAYMENT-REQUIRED", encoded);
      return c.json({ error: "Payment Required", requirements }, 402);
    }

    const verifyResult = await verify(payment, requirements);
    if (!verifyResult.isValid) {
      return c.json({ error: verifyResult.invalidReason || "Invalid payment" }, 402);
    }

    await next();

    await settle(payment, requirements);
  };
}
