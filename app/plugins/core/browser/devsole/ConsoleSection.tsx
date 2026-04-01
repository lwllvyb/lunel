import { FlashList } from "@shopify/flash-list";
import { useTheme } from "@/contexts/ThemeContext";
import { AlertTriangle, ArrowUp, Bug, CircleAlert, Info, Search, TerminalSquare, Trash2 } from "lucide-react-native";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { DevsoleConsoleEntry, DevsoleConsoleLevel } from "./types";

const LEVELS: { id: "all" | DevsoleConsoleLevel; label: string }[] = [
  { id: "all", label: "All" },
  { id: "log", label: "Log" },
  { id: "info", label: "Info" },
  { id: "warn", label: "Warn" },
  { id: "error", label: "Error" },
  { id: "debug", label: "Debug" },
];

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getLevelMeta(level: DevsoleConsoleLevel, colors: any) {
  switch (level) {
    case "error":
      return {
        Icon: CircleAlert,
        color: '#ef4444',
        bg: '#ef4444' + "12",
        label: "ERROR",
      };
    case "warn":
      return {
        Icon: AlertTriangle,
        color: '#f59e0b',
        bg: '#f59e0b' + "12",
        label: "WARN",
      };
    case "info":
      return {
        Icon: Info,
        color: colors.accent.default,
        bg: colors.accent.default + "12",
        label: "INFO",
      };
    case "debug":
      return {
        Icon: Bug,
        color: colors.fg.muted,
        bg: colors.bg.raised,
        label: "DEBUG",
      };
    default:
      return {
        Icon: TerminalSquare,
        color: colors.fg.default,
        bg: colors.bg.raised,
        label: "LOG",
      };
  }
}

const ConsoleRow = memo(function ConsoleRow({
  item,
}: {
  item: DevsoleConsoleEntry;
}) {
  const { colors, fonts, radius } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const meta = getLevelMeta(item.level, colors);
  const preview = item.values.map((value) => value.preview).join(" ");

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setExpanded((current) => !current)}
      style={{
        paddingHorizontal: 2,
        paddingVertical: 6,
        gap: 6,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text
              style={{
                color: meta.color,
                fontSize: 9,
                fontFamily: fonts.sans.semibold,
              }}
            >
              {meta.label}
            </Text>
            <Text
              style={{
                color: colors.fg.subtle,
                fontSize: 9,
                fontFamily: fonts.mono.regular,
              }}
            >
              {formatTime(item.timestamp)}
            </Text>
          </View>
          <Text
            numberOfLines={expanded ? undefined : 2}
            style={{
              color: colors.fg.default,
              fontSize: 11,
              lineHeight: 15,
              fontFamily: fonts.mono.regular,
            }}
          >
            {preview || "[empty]"}
          </Text>
        </View>
      </View>

      {expanded && (
        <View
          style={{
            gap: 6,
            paddingTop: 1,
            paddingLeft: 0,
          }}
        >
          {item.values.map((value, index) => (
            <View
              key={`${item.id}-${index}`}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 7,
                borderRadius: radius.md,
                backgroundColor: colors.bg.raised,
              }}
            >
              <Text
                style={{
                  color: colors.fg.subtle,
                  fontSize: 8,
                  fontFamily: fonts.sans.medium,
                  textTransform: "uppercase",
                }}
              >
                {value.type}
              </Text>
              <Text
                style={{
                  color: colors.fg.default,
                  fontSize: 10,
                  lineHeight: 14,
                  fontFamily: fonts.mono.regular,
                  marginTop: 3,
                }}
              >
                {value.preview}
              </Text>
            </View>
          ))}

          {item.stack ? (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 7,
                borderRadius: radius.md,
                backgroundColor: colors.bg.raised,
              }}
            >
              <Text
                style={{
                  color: colors.fg.subtle,
                  fontSize: 8,
                  fontFamily: fonts.sans.medium,
                  textTransform: "uppercase",
                }}
              >
                stack
              </Text>
              <Text
                style={{
                  color: colors.fg.default,
                  fontSize: 10,
                  lineHeight: 14,
                  fontFamily: fonts.mono.regular,
                  marginTop: 3,
                }}
              >
                {item.stack}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
});

export default function ConsoleSection({
  entries,
  onClear,
  onExecute,
  listKey,
}: {
  entries: DevsoleConsoleEntry[];
  onClear: () => void;
  onExecute: (code: string) => void;
  listKey: string;
}) {
  const { colors, fonts, radius } = useTheme();
  const [activeLevel, setActiveLevel] = useState<"all" | DevsoleConsoleLevel>("all");
  const [input, setInput] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<TextInput>(null);

  const filteredEntries = useMemo(() => {
    const levelFiltered =
      activeLevel === "all"
        ? entries
        : entries.filter((entry) => entry.level === activeLevel);

    const query = searchQuery.trim().toLowerCase();
    if (!query) return levelFiltered;

    return levelFiltered.filter((entry) => {
      const preview = entry.values.map((value) => value.preview).join(" ").toLowerCase();
      const stack = (entry.stack || "").toLowerCase();
      return preview.includes(query) || stack.includes(query) || entry.level.includes(query);
    });
  }, [activeLevel, entries, searchQuery]);

  const handleExecute = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onExecute(trimmed);
    setInput("");
  };

  useEffect(() => {
    if (!searchOpen) return;
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [searchOpen]);

  return (
    <View style={{ flex: 1, gap: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <ScrollRow>
          <TouchableOpacity
            onPress={() => setSearchOpen((current) => !current)}
            activeOpacity={0.85}
            style={{
              width: 28,
              height: 28,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: radius.full,
              backgroundColor: searchOpen ? colors.accent.default : colors.bg.raised,
              borderWidth: 1,
              borderColor: searchOpen ? colors.accent.default : colors.border.secondary,
            }}
          >
            <Search
              size={13}
              color={searchOpen ? '#ffffff' : colors.fg.default}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {LEVELS.map((level, index) => {
            const isActive = level.id === activeLevel;
            return (
              <React.Fragment key={level.id}>
                <TouchableOpacity
                  onPress={() => setActiveLevel(level.id)}
                  activeOpacity={0.85}
                  style={{
                    height: 28,
                    paddingHorizontal: 9,
                    borderRadius: radius.full,
                    backgroundColor: isActive ? colors.accent.default : colors.bg.raised,
                    borderWidth: 1,
                    borderColor: isActive ? colors.accent.default : colors.border.secondary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: isActive ? '#ffffff' : colors.fg.default,
                      fontSize: 10,
                      lineHeight: 10,
                      fontFamily: isActive ? fonts.sans.semibold : fonts.sans.medium,
                      includeFontPadding: false,
                    }}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </ScrollRow>

        <TouchableOpacity
          onPress={onClear}
          style={{
            width: 28,
            height: 28,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: radius.full,
            backgroundColor: colors.bg.raised,
            borderWidth: 1,
            borderColor: colors.border.secondary,
          }}
        >
          <Trash2 size={13} color={colors.fg.default} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {searchOpen ? (
        <View
          style={{
            minHeight: 32,
            paddingHorizontal: 10,
            backgroundColor: colors.bg.raised,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: colors.border.secondary,
            justifyContent: "center",
          }}
        >
          <TextInput
            ref={searchInputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search console"
            placeholderTextColor={colors.fg.subtle}
            style={{
              color: colors.fg.default,
              fontSize: 11,
              fontFamily: fonts.mono.regular,
              paddingVertical: 0,
            }}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
      ) : null}

      <View style={{ flex: 1 }}>
        {filteredEntries.length === 0 ? (
          <View
            style={{
              flex: 1,
              minHeight: 180,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 20,
              gap: 10,
            }}
          >
            <TerminalSquare size={20} color={colors.fg.muted} strokeWidth={2} />
            <Text style={{ color: colors.fg.default, fontSize: 14, fontFamily: fonts.sans.semibold }}>
              No console events yet
            </Text>
            <Text
              style={{
                color: colors.fg.muted,
                fontSize: 12,
                lineHeight: 17,
                textAlign: "center",
                fontFamily: fonts.sans.regular,
              }}
            >
              Logs, errors, and unhandled promise rejections from the active page will appear here.
            </Text>
          </View>
        ) : (
          <FlashList
            key={`${listKey}:${activeLevel}:${searchQuery}`}
            data={filteredEntries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ConsoleRow item={item} />}
            estimatedItemSize={72}
            contentContainerStyle={{ paddingBottom: 8 }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.bg.raised,
                  marginLeft: 2,
                  marginVertical: 2,
                }}
              />
            )}
          />
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        }}
      >
        <View
          style={{
            flex: 1,
            minHeight: 32,
            paddingHorizontal: 8,
            backgroundColor: colors.bg.raised,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: colors.border.secondary,
            justifyContent: "center",
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleExecute}
            placeholder="Run JavaScript in page"
            placeholderTextColor={colors.fg.subtle}
            style={{
              color: colors.fg.default,
              fontSize: 11,
              fontFamily: fonts.mono.regular,
              paddingVertical: 0,
            }}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
          />
        </View>

        <TouchableOpacity
          onPress={handleExecute}
          activeOpacity={0.85}
          style={{
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: radius.full,
            backgroundColor: colors.accent.default,
            borderWidth: 1,
            borderColor: colors.accent.default,
          }}
        >
          <ArrowUp size={15} color={'#ffffff'} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1 }}>
      <FlashList
        horizontal
        data={React.Children.toArray(children)}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item }) => item as React.ReactElement}
        estimatedItemSize={64}
        contentContainerStyle={{ paddingRight: 6 }}
        ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
