import { getAmountError } from "../validation";

describe("getAmountError", () => {
  it("accepts a valid amount", () => {
    expect(getAmountError("100", "AED", "12500.00")).toBeNull();
  });

  it("rejects text that is not a number", () => {
    expect(getAmountError("abc", "AED", "12500.00")).toBe("Enter a valid amount");
  });

  it("rejects more decimals than the asset supports", () => {
    expect(getAmountError("1.234", "AED", "12500.00")).toBe(
      "AED supports up to 2 decimal places",
    );
  });

  it("rejects zero", () => {
    expect(getAmountError("0", "AED", "12500.00")).toBe("Amount must be greater than 0");
  });

  it("rejects an amount above the balance", () => {
    expect(getAmountError("12500.01", "AED", "12500.00")).toBe("Insufficient balance");
  });

  it("rejects an amount too small to receive anything", () => {
    expect(getAmountError("0.000001", "USDT", "2000.000000")).toBe(
      "Amount is too small to convert",
    );
  });
});
