import Decimal from "decimal.js";
import { create } from "zustand";

import { Asset } from "../domain/assets";
import { QuoteAmounts } from "../domain/quote";

type AppState = {
  balances: Record<Asset, string>;
  failQuote: boolean;
  failConversion: boolean;
  setFailQuote: (value: boolean) => void;
  setFailConversion: (value: boolean) => void;
  applyConversion: (quote: QuoteAmounts) => void;
};

export const useAppStore = create<AppState>((set) => ({
  balances: {
    AED: "12500.00",
    USDT: "2000.000000",
  },
  failQuote: false,
  failConversion: false,

  setFailQuote: (value) => set({ failQuote: value }),
  setFailConversion: (value) => set({ failConversion: value }),

  applyConversion: (quote) =>
    set((state) => ({
      balances: {
        ...state.balances,
        [quote.payAsset]: new Decimal(state.balances[quote.payAsset])
          .minus(quote.payAmount)
          .toString(),
        [quote.receiveAsset]: new Decimal(state.balances[quote.receiveAsset])
          .plus(quote.netReceive)
          .toString(),
      },
    })),
}));
