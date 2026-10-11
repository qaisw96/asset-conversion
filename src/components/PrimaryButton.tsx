import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { colors } from "../theme";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function PrimaryButton({ title, onPress, disabled = false, loading = false }: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading && <ActivityIndicator color={colors.primaryText} />}
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  pressed: {
    opacity: 0.85,
  },
  title: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: "700",
  },
});
