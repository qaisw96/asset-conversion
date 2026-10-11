import { Asset } from "../domain/assets";
import { calculateQuote, QuoteAmounts } from "../domain/quote";
import { useAppStore } from "../store/useAppStore";

export type Quote = QuoteAmounts & {
  expiresAt: number;
};

export type ConversionService = {
  getQuote: (payAsset: Asset, payAmount: string) => Promise<Quote>;
  confirmConversion: (quote: Quote) => Promise<void>;
};

const QUOTE_LIFETIME_MS = 15_000;

function randomDelay() {
  const ms = 500 + Math.random() * 2000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getQuote(payAsset: Asset, payAmount: string): Promise<Quote> {
  await randomDelay();

  if (useAppStore.getState().failQuote) {
    throw new Error("Could not get a quote. Please try again.");
  }

  return {
    ...calculateQuote(payAsset, payAmount),
    expiresAt: Date.now() + QUOTE_LIFETIME_MS,
  };
}

async function confirmConversion(quote: Quote): Promise<void> {
  await randomDelay();

  if (Date.now() >= quote.expiresAt) {
    throw new Error("This quote has expired.");
  }

  if (useAppStore.getState().failConversion) {
    throw new Error("The conversion failed. Please try again.");
  }
}

export const conversionService: ConversionService = {
  getQuote,
  confirmConversion,
};
