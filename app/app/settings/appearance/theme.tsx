import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import PluginHeader, { usePluginHeaderHeight } from "@/components/PluginHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { Stack, useRouter } from "expo-router";

import React from "react";
import { StyleSheet, View } from "react-native";

export default function ThemePage() {
  const { colors } = useTheme();
  const router = useRouter();
  const headerHeight = usePluginHeaderHeight();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.base, paddingTop: headerHeight }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <PluginHeader title="Theme" colors={colors} onBack={() => router.back()} />

      {/* Theme Switcher */}
      <ThemeSwitcher />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
