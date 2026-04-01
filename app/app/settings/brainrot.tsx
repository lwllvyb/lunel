import { useAppSettings } from "@/contexts/AppSettingsContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, ChevronLeft } from "lucide-react-native";
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

interface SourceOptionRowProps {
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

function SourceOptionRow({
  label,
  description,
  selected,
  onPress,
}: SourceOptionRowProps) {
  const { colors, fonts, spacing, radius } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.optionRow, { paddingVertical: spacing[3], paddingHorizontal: spacing[4] }]}
    >
      <View style={styles.optionText}>
        <Text style={[styles.optionLabel, { color: colors.fg.default, fontFamily: fonts.sans.regular }]}>
          {label}
        </Text>
        <Text style={[styles.optionDescription, { color: colors.fg.muted, fontFamily: fonts.sans.regular }]}>
          {description}
        </Text>
      </View>
      <View
        style={[
          styles.optionIndicator,
          {
            borderRadius: radius.full,
            borderColor: selected ? colors.accent.default : colors.border.secondary,
            backgroundColor: selected ? colors.accent.default : "transparent",
          },
        ]}
      >
        {selected ? <Check size={16} color="#ffffff" strokeWidth={2.5} /> : null}
      </View>
    </TouchableOpacity>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function ToggleRow({
  label,
  description,
  value,
  onValueChange,
}: ToggleRowProps) {
  const { colors, fonts, spacing } = useTheme();

  return (
    <View style={[styles.optionRow, { paddingVertical: spacing[3], paddingHorizontal: spacing[4] }]}>
      <View style={styles.optionText}>
        <Text style={[styles.optionLabel, { color: colors.fg.default, fontFamily: fonts.sans.regular }]}>
          {label}
        </Text>
        <Text style={[styles.optionDescription, { color: colors.fg.muted, fontFamily: fonts.sans.regular }]}>
          {description}
        </Text>
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

export default function BrainrotSettingsPage() {
  const { colors, fonts, radius, spacing } = useTheme();
  const { settings, updateSetting } = useAppSettings();
  const router = useRouter();
  const needsWebviewLoginNotice =
    settings.brainrotSource === "instagram"
    || settings.brainrotSource === "x"
    || settings.brainrotSource === "tiktok";

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.base }]}>
      <Stack.Screen options={{ headerShown: false }} />

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
            Brainrot
          </Text>
        </View>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium }]}>
          SOURCE
        </Text>
        <View style={[styles.section, { backgroundColor: colors.bg.raised, borderRadius: 18 }]}>
          <SourceOptionRow
            label="YouTube"
            description="Open YouTube Shorts by default"
            selected={settings.brainrotSource === "youtube"}
            onPress={() => {
              void updateSetting("brainrotSource", "youtube");
            }}
          />
          <View style={[styles.divider, { backgroundColor: colors.border.tertiary }]} />
          <SourceOptionRow
            label="Instagram"
            description="Open Instagram Reels by default"
            selected={settings.brainrotSource === "instagram"}
            onPress={() => {
              void updateSetting("brainrotSource", "instagram");
            }}
          />
          <View style={[styles.divider, { backgroundColor: colors.border.tertiary }]} />
          <SourceOptionRow
            label="X.com"
            description="Open X by default"
            selected={settings.brainrotSource === "x"}
            onPress={() => {
              void updateSetting("brainrotSource", "x");
            }}
          />
          <View style={[styles.divider, { backgroundColor: colors.border.tertiary }]} />
          <SourceOptionRow
            label="TikTok"
            description="Open TikTok by default"
            selected={settings.brainrotSource === "tiktok"}
            onPress={() => {
              void updateSetting("brainrotSource", "tiktok");
            }}
          />
          {needsWebviewLoginNotice ? (
            <View
              style={[
                styles.inlineNote,
                {
                  borderTopColor: colors.border.tertiary,
                },
              ]}
            >
              <Text style={[styles.noteText, { color: colors.fg.muted, fontFamily: fonts.sans.regular }]}>
                You may have to log in once in the plugin for this source.
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.sectionHeader, { color: colors.fg.muted, fontFamily: fonts.sans.medium }]}>
          INTEGRATION
        </Text>
        <View style={[styles.section, { backgroundColor: colors.bg.raised, borderRadius: 18 }]}>
          <ToggleRow
            label="AI Chat Integration"
            description="Show Brainrot while AI is processing, then return to AI chat"
            value={settings.brainrotAiChatIntegration}
            onValueChange={(value) => {
              void updateSetting("brainrotAiChatIntegration", value);
            }}
          />
        </View>

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
    opacity: 0,
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
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
  },
  optionDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  optionIndicator: {
    width: 24,
    height: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  inlineNote: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  noteText: {
    fontSize: 13,
    lineHeight: 19,
  },
});
