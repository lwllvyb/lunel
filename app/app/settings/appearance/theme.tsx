import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronLeft } from "lucide-react-native";
import { Stack, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ThemePage() {
  const { colors, fonts, radius } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.base }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.bg.base }]}>
        <TouchableOpacity
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={[
            styles.backButton,
            {
              borderRadius: radius.full,
              backgroundColor: colors.bg.raised,
              borderColor: colors.border.secondary,
              borderWidth: 0.5,
            },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={24} color={colors.fg.default} strokeWidth={2} />
        </TouchableOpacity>
        <View
          style={[
            styles.titlePill,
            {
              borderRadius: radius.full,
              backgroundColor: colors.bg.raised,
              borderColor: colors.border.secondary,
              borderWidth: 0.5,
            },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.fg.default, fontFamily: fonts.sans.semibold }]}>
            Theme
          </Text>
        </View>
        <View style={[styles.rightPlaceholder, { opacity: 0 }]} />
      </View>

      {/* Theme Switcher */}
      <ThemeSwitcher />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    height: 64,
    paddingBottom: 10,
  },
  backButton: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  titlePill: {
    minHeight: 45,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 16,
  },
  rightPlaceholder: {
    width: 45,
    height: 45,
  },
});
