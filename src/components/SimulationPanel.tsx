import { StyleSheet, Switch, Text, View } from "react-native";

import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme";

export function SimulationPanel() {
  const failQuote = useAppStore((store) => store.failQuote);
  const failConversion = useAppStore((store) => store.failConversion);
  const setFailQuote = useAppStore((store) => store.setFailQuote);
  const setFailConversion = useAppStore((store) => store.setFailConversion);

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Simulation</Text>
      <Text style={styles.hint}>Force errors to try every state.</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Fail quote</Text>
        <Switch value={failQuote} onValueChange={setFailQuote} accessibilityLabel="Fail quote" />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Fail conversion</Text>
        <Switch
          value={failConversion}
          onValueChange={setFailConversion}
          accessibilityLabel="Fail conversion"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  title: {
    color: colors.text,
    fontWeight: "700",
  },
  hint: {
    color: colors.muted,
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: colors.text,
  },
});
