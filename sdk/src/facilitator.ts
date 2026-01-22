import { Facilitator, CronosNetwork } from "@crypto.com/facilitator-client";
import type { PaymentRequirements } from "@crypto.com/facilitator-client";

export const facilitator = new Facilitator({
  network: CronosNetwork.CronosTestnet,
});

export async function verify(payment: string, requirements: PaymentRequirements) {
  const body = facilitator.buildVerifyRequest(payment, requirements);
  return facilitator.verifyPayment(body);
}

export async function settle(payment: string, requirements: PaymentRequirements) {
  const body = facilitator.buildVerifyRequest(payment, requirements);
  return facilitator.settlePayment(body);
}

export { Facilitator, CronosNetwork };
export type { PaymentRequirements };
