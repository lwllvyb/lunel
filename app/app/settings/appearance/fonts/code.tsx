import { useTheme } from "@/contexts/ThemeContext";
import {
  MonoFamilyId,
  monoFamilies,
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
  onSelect: () => void;
}

function FontOption({ name, sampleText, fontFamily, isSelected, onSelect }: FontOptionProps) {
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
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.sans.semibold,
            color: isSelected ? colors.accent.default : colors.fg.default,
          }}
        >
          {name}
        </Text>
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

export default function CodeFontPage() {
  const {
    colors,
    fonts,
    spacing,
    radius,
    fontSelection,
    setMonoFont,
  } = useTheme();
  const router = useRouter();

  const monoFontIds = Object.keys(monoFamilies) as MonoFamilyId[];

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
            Code Font
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert(
                "Code Font",
                "Used for code, terminal, and technical content.\n\nMonospace helps align indentation and symbols.\nPick one that clearly distinguishes characters like 0/O and 1/l."
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
          {monoFontIds.map((id) => {
            const family = monoFamilies[id];
            return (
              <FontOption
                key={id}
                name={family.name}
                sampleText="const app = () => { return 'Hello'; }"
                fontFamily={family.regular}
                isSelected={fontSelection.mono === id}
                onSelect={() => setMonoFont(id)}
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
