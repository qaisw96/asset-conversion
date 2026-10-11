import Decimal from "decimal.js";

import { Asset, PRECISION } from "./assets";
import { calculateQuote } from "./quote";

const NUMBER_PATTERN = /^\d+\.?\d*$/;

export function getAmountError(
  input: string,
  payAsset: Asset,
  balance: string,
): string | null {
  if (input === "") {
    return null;
  }

  if (!NUMBER_PATTERN.test(input)) {
    return "Enter a valid amount";
  }

  const decimals = input.split(".")[1] ?? "";
  if (decimals.length > PRECISION[payAsset]) {
    return `${payAsset} supports up to ${PRECISION[payAsset]} decimal places`;
  }

  const amount = new Decimal(input);
  if (amount.isZero()) {
    return "Amount must be greater than 0";
  }

  if (amount.greaterThan(balance)) {
    return "Insufficient balance";
  }

  if (calculateQuote(payAsset, input).netReceive.isZero()) {
    return "Amount is too small to convert";
  }

  return null;
}
