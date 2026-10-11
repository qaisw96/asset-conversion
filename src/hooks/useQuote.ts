import { useCallback, useEffect, useRef, useState } from "react";

import { Asset } from "../domain/assets";
import { conversionService, Quote } from "../services/conversionService";

const DEBOUNCE_MS = 400;

export type QuoteState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; quote: Quote }
  | { status: "expired"; quote: Quote }
  | { status: "error"; message: string };

export function useQuote(payAsset: Asset, amount: string, canRequest: boolean) {
  const [state, setState] = useState<QuoteState>({ status: "idle" });
  const [secondsLeft, setSecondsLeft] = useState(0);
  const latestRequestId = useRef(0);

  const requestQuote = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    setState({ status: "loading" });

    try {
      const quote = await conversionService.getQuote(payAsset, amount);
      if (requestId === latestRequestId.current) {
        setState({ status: "ready", quote });
      }
    } catch (error) {
      if (requestId === latestRequestId.current) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        setState({ status: "error", message });
      }
    }
  }, [payAsset, amount]);

  useEffect(() => {
    setState({ status: "idle" });

    if (!canRequest) {
      return;
    }

    const timer = setTimeout(requestQuote, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      latestRequestId.current++;
    };
  }, [canRequest, requestQuote]);

  useEffect(() => {
    if (state.status !== "ready") {
      return;
    }

    const quote = state.quote;

    function tick() {
      const left = Math.ceil((quote.expiresAt - Date.now()) / 1000);
      if (left <= 0) {
        setState({ status: "expired", quote });
      } else {
        setSecondsLeft(left);
      }
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [state]);

  return { state, secondsLeft, refresh: requestQuote };
}
