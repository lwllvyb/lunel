import { useTheme } from "@/contexts/ThemeContext";
import {
  NormalFamilyId,
  normalFamilies,
  DEFAULT_FONT_SELECTION,
} from "@/constants/themes";
import { ChevronLeft, Check, Info } from "lucide-react-native";
import { Stack, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import React from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FontOptionProps {
  name: string;
  sampleText: string;
  fontFamily: string;
  isSelected: boolean;
  isDefault: boolean;
  onSelect: () => void;
}

function FontOption({ name, sampleText, fontFamily, isSelected, isDefault, onSelect }: FontOptionProps) {
  const { colors, fonts, spacing, radius } = useTheme();

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[
        styles.fontOption,
        {
          backgroundColor: isSelected ? colors.accent.default + '20' : colors.bg.raised,
          borderRadius: 18,
          padding: spacing[4],
          marginBottom: spacing[3],
        },
      ]}
    >
      <View style={styles.fontOptionHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing[2] }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.sans.semibold,
              color: isSelected ? colors.accent.default : colors.fg.default,
            }}
          >
            {name}
          </Text>
          {isDefault && (
            <View style={{ backgroundColor: colors.accent.default + '30', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ fontSize: 11, fontFamily: fonts.sans.medium, color: colors.accent.default }}>
                Default
              </Text>
            </View>
          )}
        </View>
        {isSelected && (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: radius.full,
              backgroundColor: colors.accent.default,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={16} color={'#ffffff'} strokeWidth={3} />
          </View>
        )}
      </View>
      <Text
        style={{
          fontSize: 18,
          fontFamily: fontFamily,
          color: colors.fg.muted,
          marginTop: spacing[2],
        }}
      >
        {sampleText}
      </Text>
    </TouchableOpacity>
  );
}

export default function NormalFontPage() {
  const {
    colors,
    fonts,
    spacing,
    radius,
    fontSelection,
    setNormalFont,
  } = useTheme();
  const router = useRouter();

  const normalFontIds = Object.keys(normalFamilies) as NormalFamilyId[];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.base }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.bg.base,
            marginBottom: spacing[2],
          },
        ]}
      >
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
          <Text
            style={[
              styles.headerTitle,
              { color: colors.fg.default, fontFamily: fonts.sans.semibold },
            ]}
          >
            Normal Font
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert(
                "Normal Font",
                "Used for UI text, labels, and most readable content.\n\nChoose a clean, balanced font for long reading sessions.\nIt has the biggest impact on overall app readability."
              );
            }
          }
          style={[
            styles.rightPlaceholder,
            {
              borderRadius: radius.full,
              backgroundColor: colors.bg.raised,
              borderColor: colors.border.secondary,
              borderWidth: 0.5,
            },
          ]}
          activeOpacity={0.7}
        >
          <Info size={18} color={colors.fg.muted} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: spacing[4] }}>
          {normalFontIds.map((id) => {
            const family = normalFamilies[id];
            return (
              <FontOption
                key={id}
                name={family.name}
                sampleText="The quick brown fox jumps over the lazy dog"
                fontFamily={family.regular}
                isSelected={fontSelection.normal === id}
                isDefault={id === DEFAULT_FONT_SELECTION.normal}
                onSelect={() => setNormalFont(id)}
              />
            );
          })}
        </View>

        {/* Bottom padding */}
        <View style={{ height: spacing[8] }} />
      </ScrollView>
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
    alignItems: "center",
    justifyContent: "center",
  },
  fontOption: {
    flexDirection: "column",
  },
  fontOptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
