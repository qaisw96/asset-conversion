import Decimal from "decimal.js";
import { Modal, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Asset } from "../domain/assets";
import { formatAmount } from "../domain/format";
import { ConvertState } from "../hooks/useConvert";
import { colors } from "../theme";
import { PrimaryButton } from "./PrimaryButton";

type Props = {
  state: ConvertState;
  balances: Record<Asset, string>;
  onDone: () => void;
  onTryAgain: () => void;
};

export function ResultSheet({ state, balances, onDone, onTryAgain }: Props) {
  const insets = useSafeAreaInsets();
  const isSuccess = state.status === "success";
  const isVisible = state.status === "success" || state.status === "failure";

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={isSuccess ? onDone : onTryAgain}
    >
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.handle} />

          {state.status === "success" && (
            <>
              <View style={[styles.icon, styles.successIcon]}>
                <Text style={[styles.iconText, { color: colors.success }]}>✓</Text>
              </View>
              <Text style={styles.title}>Conversion complete</Text>
              <Text style={styles.muted}>You received</Text>
              <Text style={styles.amount}>
                {formatAmount(state.quote.netReceive, state.quote.receiveAsset)}{" "}
                {state.quote.receiveAsset}
              </Text>
              <Text style={styles.muted}>
                for {formatAmount(state.quote.payAmount, state.quote.payAsset)}{" "}
                {state.quote.payAsset}
              </Text>

              <View style={styles.balances}>
                <BalanceRow asset="AED" balance={balances.AED} />
                <BalanceRow asset="USDT" balance={balances.USDT} />
              </View>

              <PrimaryButton title="Done" onPress={onDone} />
            </>
          )}

          {state.status === "failure" && (
            <>
              <View style={[styles.icon, styles.failureIcon]}>
                <Text style={[styles.iconText, { color: colors.danger }]}>!</Text>
              </View>
              <Text style={styles.title}>Conversion failed</Text>
              <Text style={styles.message}>{state.message}</Text>
              <Text style={styles.muted}>Your balances have not changed.</Text>

              <PrimaryButton title="Try again" onPress={onTryAgain} />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

function BalanceRow({ asset, balance }: { asset: Asset; balance: string }) {
  return (
    <View style={styles.balanceRow}>
      <Text style={styles.muted}>{asset} balance</Text>
      <Text style={styles.balanceValue}>{formatAmount(new Decimal(balance), asset)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.backdrop,
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 8,
  },
  icon: {
    alignSelf: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    backgroundColor: colors.successBackground,
  },
  failureIcon: {
    backgroundColor: colors.dangerBackground,
  },
  iconText: {
    fontSize: 28,
    fontWeight: "700",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  amount: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    fontVariant: ["tabular-nums"],
  },
  message: {
    textAlign: "center",
    color: colors.text,
    fontSize: 15,
  },
  muted: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 14,
  },
  balances: {
    gap: 8,
    marginVertical: 8,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
  },
  balanceValue: {
    color: colors.text,
    fontVariant: ["tabular-nums"],
  },
});
