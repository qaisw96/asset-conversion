import Decimal from "decimal.js";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Asset } from "../domain/assets";
import { formatAmount } from "../domain/format";
import { colors } from "../theme";

type Props = {
  label: string;
  asset: Asset;
  balance: string;
  value: string;
  onChangeText?: (text: string) => void;
  onMax?: () => void;
  error?: string | null;
  editable?: boolean;
};

export function AssetField({
  label,
  asset,
  balance,
  value,
  onChangeText,
  onMax,
  error,
  editable = true,
}: Props) {
  return (
    <View style={[styles.card, error && styles.cardError]}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.row}>
        <View style={styles.assetPill}>
          <Text style={styles.assetText}>{asset}</Text>
        </View>

        {onChangeText ? (
          <TextInput
            accessibilityLabel={label}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            placeholder="0.00"
            placeholderTextColor={colors.disabled}
            keyboardType="decimal-pad"
            style={styles.amount}
          />
        ) : (
          <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
            {value}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.balance}>
          Balance: {formatAmount(new Decimal(balance), asset)} {asset}
        </Text>
        {onMax && editable && (
          <Pressable accessibilityRole="button" onPress={onMax} hitSlop={8}>
            <Text style={styles.max}>Max</Text>
          </Pressable>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  cardError: {
    borderColor: colors.danger,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  assetPill: {
    backgroundColor: colors.background,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  assetText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 15,
  },
  amount: {
    flex: 1,
    textAlign: "right",
    color: colors.text,
    fontSize: 26,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
    padding: 0,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balance: {
    color: colors.muted,
    fontSize: 13,
  },
  max: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
  },
});
