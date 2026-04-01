import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/contexts/ThemeContext";
import { RefreshCw } from "lucide-react-native";
import React, { useEffect, useMemo } from "react";
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { DevsoleInfoSnapshot } from "./types";

export default function InfoSection({
  snapshot,
  listKey,
  onRefresh,
}: {
  snapshot: DevsoleInfoSnapshot | null;
  listKey: string;
  onRefresh: () => void;
}) {
  const { colors, fonts, radius } = useTheme();

  useEffect(() => {
    void listKey;
  }, [listKey]);

  const sections = useMemo(() => {
    const grouped = new Map<string, { label: string; value: string }[]>();
    (snapshot?.fields || []).forEach((field) => {
      const current = grouped.get(field.section) || [];
      current.push({ label: field.label, value: field.value });
      grouped.set(field.section, current);
    });
    return Array.from(grouped.entries());
  }, [snapshot]);

  return (
    <View style={{ flex: 1, gap: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
        <TouchableOpacity
          onPress={onRefresh}
          activeOpacity={0.85}
          style={{
            width: 28,
            height: 28,
            borderRadius: radius.full,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.bg.base,
            borderWidth: 1,
            borderColor: colors.bg.raised,
          }}
        >
          <RefreshCw size={13} color={colors.fg.default} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
        {sections.length === 0 ? (
          <View style={{ paddingTop: 40, alignItems: "center", gap: 8 }}>
            <Text style={{ color: colors.fg.default, fontSize: 14, fontFamily: fonts.sans.semibold }}>
              No info yet
            </Text>
          </View>
        ) : null}

        {sections.map(([section, fields]) => (
          <View
            key={section}
            style={{
              overflow: "hidden",
            }}
          >
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border.secondary,
              }}
            >
              <Text
                style={{
                  color: colors.fg.subtle,
                  fontSize: 9,
                  fontFamily: fonts.sans.medium,
                  textTransform: "uppercase",
                }}
              >
                {section}
              </Text>
            </View>

            {fields.map((field, index) => (
              <View
                key={`${section}-${field.label}`}
                style={{
                  flexDirection: "row",
                  alignItems: "stretch",
                  borderBottomWidth: index === fields.length - 1 ? 0 : 1,
                  borderBottomColor: colors.border.secondary,
                }}
              >
                <View
                  style={{
                  width: 118,
                  paddingHorizontal: 10,
                  paddingVertical: 9,
                  justifyContent: "center",
                }}
              >
                  <Text
                    style={{
                      color: colors.fg.subtle,
                      fontSize: 10,
                      lineHeight: 14,
                      fontFamily: fonts.sans.medium,
                    }}
                  >
                    {field.label}
                  </Text>
                </View>

                <Pressable
                  onLongPress={() => Clipboard.setStringAsync(field.value)}
                  delayLongPress={180}
                  style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 9,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.fg.default,
                      fontSize: 10,
                      lineHeight: 14,
                      fontFamily: fonts.mono.regular,
                    }}
                  >
                    {field.value || "—"}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
