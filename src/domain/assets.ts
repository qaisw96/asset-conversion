export type Asset = "AED" | "USDT";

export const ASSETS: Asset[] = ["AED", "USDT"];

export const PRECISION: Record<Asset, number> = {
  AED: 2,
  USDT: 6,
};

export const AED_PER_USDT = "3.6725";
export const FEE_RATE = "0.005";

export function otherAsset(asset: Asset): Asset {
  return asset === "AED" ? "USDT" : "AED";
}
