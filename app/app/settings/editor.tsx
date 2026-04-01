import { useEditorConfig } from "@/contexts/EditorContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronLeft, Minus, Plus } from "lucide-react-native";
import { Stack, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function ToggleRow({ label, description, value, onValueChange }: ToggleRowProps) {
  const { colors, fonts, spacing } = useTheme();

  return (
    <View style={[styles.row, { paddingVertical: spacing[3], paddingHorizontal: spacing[4] }]}>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: colors.fg.default, fontFamily: fonts.sans.regular }]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.rowDescription, { color: colors.fg.muted, fontFamily: fonts.sans.regular }]}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border.main, true: colors.accent.default }}
        ios_backgroundColor={colors.border.main}
        thumbColor={value ? "#ffffff" : colors.bg.base}
      />
    </View>
  );
}

interface StepperRowProps {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onValueChange: (value: number) => void;
}

function StepperRow({ label, description, value, min, max, step = 1, unit = "", onValueChange }: StepperRowProps) {
  const { colors, fonts, spacing, radius } = useTheme();

  const handleDecrement = () => {
    if (value > min) {
      onValueChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onValueChange(value + step);
    }
  };

  return (
    <View style={[styles.row, { paddingVertical: spacing[3], paddingHorizontal: spacing[4] }]}>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: colors.fg.default, fontFamily: fonts.sans.regular }]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.rowDescription, { color: colors.fg.muted, fontFamily: fonts.sans.regular }]}>
            {description}
          </Text>
        )}
      </View>
      <View style={styles.stepperContainer}>
        <TouchableOpacity
          onPress={handleDecrement}
          disabled={value <= min}
          style={[
            styles.stepperButton,
            {
              backgroundColor: colors.bg.raised,
              borderRadius: radius.md,
              opacity: value <= min ? 0.4 : 1,
            },
          ]}
        >
          <Minus size={18} color={colors.fg.default} strokeWidth={2} />
        </TouchableOpacity>
        <Text
          style={[
            styles.stepperValue,
            { color: colors.fg.default, fontFamily: fonts.mono.medium, minWidth: 48 },
          ]}
        >
          {value}{unit}
        </Text>
        <TouchableOpacity
          onPress={handleIncrement}
          disabled={value >= max}
          style={[
            styles.stepperButton,
            {
              backgroundColor: colors.bg.raised,
              borderRadius: radius.md,
              opacity: value >= max ? 0.4 : 1,
            },
          ]}
        >
          <Plus size={18} color={colors.fg.default} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function EditorSettingsPage() {
  const { colors, fonts, radius, spacing } = useTheme();
  const { config, updateConfig } = useEditorConfig();
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
            Editor
          </Text>
        </View>
        <View style={[styles.rightPlaceholder, { opacity: 0 }]} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
        {/* Font Section */}
        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium }]}>
          FONT
        </Text>
        <View style={[styles.section, { backgroundColor: colors.bg.raised, borderRadius: 18 }]}>
          <StepperRow
            label="Font Size"
            description="Size of text in the editor"
            value={config.fontSize}
            min={10}
            max={24}
            step={1}
            unit="px"
            onValueChange={(value) => updateConfig("fontSize", value)}
          />
          <ToggleRow
            label="Wrap Lines"
            description="Soft-wrap long lines in the editor"
            value={config.wrapLines}
            onValueChange={(value) => updateConfig("wrapLines", value)}
          />
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
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 12,
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  section: {
    marginHorizontal: 16,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: {
    flex: 1,
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 16,
  },
  rowDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stepperButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    fontSize: 15,
    textAlign: "center",
  },
});
