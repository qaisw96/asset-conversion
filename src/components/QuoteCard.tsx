import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { AED_PER_USDT } from "../domain/assets";
import { formatAmount, formatDetail } from "../domain/format";
import { QuoteState } from "../hooks/useQuote";
import { colors } from "../theme";

type Props = {
  state: QuoteState;
  secondsLeft: number;
  onRefresh: () => void;
};

export function QuoteCard({ state, secondsLeft, onRefresh }: Props) {
  if (state.status === "idle") {
    return null;
  }

  if (state.status === "loading") {
    return (
      <View style={[styles.card, styles.centered]}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.muted}>Getting quote…</Text>
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View style={[styles.banner, styles.errorBanner]}>
        <Text style={styles.errorText}>{state.message}</Text>
        <TextButton title="Retry" color={colors.danger} onPress={onRefresh} />
      </View>
    );
  }

  const { quote } = state;
  const isExpired = state.status === "expired";

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, isExpired && styles.faded]}>
        <View style={styles.details}>
          <Text style={styles.muted}>1 USDT = {AED_PER_USDT} AED</Text>
          <Row label="You pay" value={`${formatAmount(quote.payAmount, quote.payAsset)} ${quote.payAsset}`} />
          <Row label="Gross amount" value={`${formatDetail(quote.grossReceive)} ${quote.receiveAsset}`} />
          <Row label="Service fee (0.5%)" value={`${formatDetail(quote.fee)} ${quote.receiveAsset}`} />
          <View style={styles.divider} />
          <Row
            label="You receive"
            value={`${formatAmount(quote.netReceive, quote.receiveAsset)} ${quote.receiveAsset}`}
            bold
          />
        </View>
        {!isExpired && (
          <Text style={[styles.muted, secondsLeft <= 5 && styles.warningText]}>
            Quote expires in <Text style={styles.seconds}>{secondsLeft}s</Text>
          </Text>
        )}
      </View>

      {isExpired && (
        <View style={[styles.banner, styles.warningBanner]}>
          <Text style={styles.warningText}>
            Quote expired. Quotes are valid for 15 seconds.
          </Text>
          <TextButton title="Refresh quote" color={colors.warning} onPress={onRefresh} />
        </View>
      )}
    </View>
  );
}

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

function TextButton({ title, color, onPress }: { title: string; color: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.textButton, { borderColor: color }]}
    >
      <Text style={[styles.textButtonTitle, { color }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
  },
  centered: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  faded: {
    opacity: 0.45,
  },
  details: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  rowLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  rowValue: {
    color: colors.text,
    fontSize: 14,
    fontVariant: ["tabular-nums"],
  },
  bold: {
    color: colors.text,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  muted: {
    color: colors.muted,
    fontSize: 13,
  },
  banner: {
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  errorBanner: {
    backgroundColor: colors.dangerBackground,
  },
  errorText: {
    color: colors.danger,
  },
  warningBanner: {
    backgroundColor: colors.warningBackground,
  },
  warningText: {
    color: colors.warning,
  },
  seconds: {
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  textButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  textButtonTitle: {
    fontWeight: "600",
  },
});
