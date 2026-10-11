import { useState } from "react";

import { conversionService, Quote } from "../services/conversionService";
import { useAppStore } from "../store/useAppStore";

export type ConvertState =
  | { status: "idle" }
  | { status: "confirming" }
  | { status: "success"; quote: Quote }
  | { status: "failure"; message: string };

export function useConvert() {
  const [state, setState] = useState<ConvertState>({ status: "idle" });
  const applyConversion = useAppStore((store) => store.applyConversion);

  async function confirm(quote: Quote) {
    if (Date.now() >= quote.expiresAt) {
      setState({ status: "failure", message: "This quote has expired. Please get a new one." });
      return;
    }

    setState({ status: "confirming" });

    try {
      await conversionService.confirmConversion(quote);
      applyConversion(quote);
      setState({ status: "success", quote });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      setState({ status: "failure", message });
    }
  }

  function reset() {
    setState({ status: "idle" });
  }

  return { state, confirm, reset };
}
