import Decimal from "decimal.js";

import { AED_PER_USDT, Asset, FEE_RATE, PRECISION, otherAsset } from "./assets";

export type QuoteAmounts = {
  payAsset: Asset;
  receiveAsset: Asset;
  payAmount: Decimal;
  grossReceive: Decimal;
  fee: Decimal;
  netReceive: Decimal;
};

export function calculateQuote(payAsset: Asset, payAmount: string): QuoteAmounts {
  const receiveAsset = otherAsset(payAsset);
  const amount = new Decimal(payAmount);

  const grossReceive =
    payAsset === "AED" ? amount.div(AED_PER_USDT) : amount.mul(AED_PER_USDT);
  const fee = grossReceive.mul(FEE_RATE);
  const netReceive = grossReceive
    .minus(fee)
    .toDecimalPlaces(PRECISION[receiveAsset], Decimal.ROUND_DOWN);

  return {
    payAsset,
    receiveAsset,
    payAmount: amount,
    grossReceive,
    fee,
    netReceive,
  };
}
