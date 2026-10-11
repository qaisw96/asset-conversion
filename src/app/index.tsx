import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AssetField } from "../components/AssetField";
import { PrimaryButton } from "../components/PrimaryButton";
import { QuoteCard } from "../components/QuoteCard";
import { ResultSheet } from "../components/ResultSheet";
import { SimulationPanel } from "../components/SimulationPanel";
import { Asset, PRECISION, otherAsset } from "../domain/assets";
import { formatAmount } from "../domain/format";
import { getAmountError } from "../domain/validation";
import { useConvert } from "../hooks/useConvert";
import { useQuote } from "../hooks/useQuote";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme";

const TYPING_PATTERN = /^\d*\.?\d*$/;

export default function ConvertScreen() {
  const balances = useAppStore((store) => store.balances);
  const [payAsset, setPayAsset] = useState<Asset>("AED");
  const [amount, setAmount] = useState("");
  const receiveAsset = otherAsset(payAsset);

  const amountError = getAmountError(amount, payAsset, balances[payAsset]);
  const canRequest = amount !== "" && amountError === null;

  const { state: quoteState, secondsLeft, refresh } = useQuote(payAsset, amount, canRequest);
  const { state: convertState, confirm, reset } = useConvert();

  const quote = quoteState.status === "ready" ? quoteState.quote : null;
  const isConfirming = convertState.status === "confirming";

  function handleAmountChange(text: string) {
    let next = text.replace(",", ".");
    if (next.startsWith(".")) {
      next = `0${next}`;
    }

    const decimals = next.split(".")[1] ?? "";
    if (!TYPING_PATTERN.test(next) || decimals.length > PRECISION[payAsset]) {
      return;
    }

    setAmount(next);
  }

  function swapAssets() {
    setPayAsset(receiveAsset);
    setAmount("");
  }

  function handleDone() {
    reset();
    setAmount("");
  }

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <View>
          <AssetField
            label="You pay"
            asset={payAsset}
            balance={balances[payAsset]}
            value={amount}
            onChangeText={handleAmountChange}
            onMax={() => setAmount(balances[payAsset])}
            error={amountError}
            editable={!isConfirming}
          />

          <View style={styles.swapRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Swap assets"
              onPress={swapAssets}
              disabled={isConfirming}
              style={styles.swapButton}
            >
              <Text style={styles.swapIcon}>⇅</Text>
            </Pressable>
          </View>

          <AssetField
            label="You receive (estimated)"
            asset={receiveAsset}
            balance={balances[receiveAsset]}
            value={quote ? formatAmount(quote.netReceive, receiveAsset) : "—"}
          />
        </View>

        {amount === "" && (
          <Text style={styles.hint}>Enter an amount to see a quote</Text>
        )}

        <QuoteCard state={quoteState} secondsLeft={secondsLeft} onRefresh={refresh} />

        <PrimaryButton
          title={isConfirming ? "Confirming…" : "Confirm conversion"}
          onPress={() => quote && confirm(quote)}
          disabled={!quote}
          loading={isConfirming}
        />

        <SimulationPanel />
      </ScrollView>

      <ResultSheet
        state={convertState}
        balances={balances}
        onDone={handleDone}
        onTryAgain={reset}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  swapRow: {
    alignItems: "center",
    marginVertical: -12,
    zIndex: 1,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  swapIcon: {
    color: colors.primary,
    fontSize: 18,
  },
  hint: {
    textAlign: "center",
    color: colors.muted,
  },
});
