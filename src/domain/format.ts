import Decimal from "decimal.js";

import { Asset, PRECISION } from "./assets";

const MAX_DETAIL_DECIMALS = 6;

function addThousandsSeparators(value: string): string {
  const [whole, decimals] = value.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimals ? `${grouped}.${decimals}` : grouped;
}

export function formatAmount(value: Decimal, asset: Asset): string {
  const fixed = value.toFixed(PRECISION[asset], Decimal.ROUND_DOWN);
  return addThousandsSeparators(fixed);
}

export function formatDetail(value: Decimal): string {
  const trimmed = value
    .toDecimalPlaces(MAX_DETAIL_DECIMALS, Decimal.ROUND_DOWN)
    .toString();
  return addThousandsSeparators(trimmed);
}
