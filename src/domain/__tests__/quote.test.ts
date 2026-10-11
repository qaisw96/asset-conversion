import { formatAmount, formatDetail } from "../format";
import { calculateQuote } from "../quote";

describe("calculateQuote", () => {
  it("AED 3,672.50 → 1,000 USDT gross, 5 USDT fee, 995 USDT net", () => {
    const quote = calculateQuote("AED", "3672.50");

    expect(formatDetail(quote.grossReceive)).toBe("1,000");
    expect(formatDetail(quote.fee)).toBe("5");
    expect(formatAmount(quote.netReceive, "USDT")).toBe("995.000000");
  });

  it("AED 100.00 → 27.229407 USDT gross, 0.136147 USDT fee, 27.093260 USDT net", () => {
    const quote = calculateQuote("AED", "100.00");

    expect(formatDetail(quote.grossReceive)).toBe("27.229407");
    expect(formatDetail(quote.fee)).toBe("0.136147");
    expect(formatAmount(quote.netReceive, "USDT")).toBe("27.093260");
  });

  it("USDT 100 → AED 367.25 gross, AED 1.83625 fee, AED 365.41 net", () => {
    const quote = calculateQuote("USDT", "100");

    expect(formatDetail(quote.grossReceive)).toBe("367.25");
    expect(formatDetail(quote.fee)).toBe("1.83625");
    expect(formatAmount(quote.netReceive, "AED")).toBe("365.41");
  });
});
