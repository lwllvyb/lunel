import { useTheme } from "@/contexts/ThemeContext";
import { Plus, RefreshCw, Trash2, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

function sortPorts(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

export default function ProxiesSection({
  trackedPorts,
  openPorts,
  isSubmitting,
  error,
  onRefresh,
  onTrackPort,
  onUntrackPort,
}: {
  trackedPorts: number[];
  openPorts: number[];
  isSubmitting: boolean;
  error: string | null;
  onRefresh: () => void;
  onTrackPort: (port: number) => Promise<void>;
  onUntrackPort: (port: number) => Promise<void>;
}) {
  const { colors, fonts, radius } = useTheme();
  const [draftPort, setDraftPort] = useState("");
  const [showAddRow, setShowAddRow] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [pendingDeletePort, setPendingDeletePort] = useState<number | null>(null);

  const sortedTrackedPorts = useMemo(() => sortPorts(trackedPorts), [trackedPorts]);
  const openPortSet = useMemo(() => new Set(sortPorts(openPorts)), [openPorts]);

  const handleAddPort = async () => {
    const parsedPort = Number(draftPort.trim());
    if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
      setLocalError("Enter a valid port between 1 and 65535.");
      return;
    }

    setLocalError(null);
    await onTrackPort(parsedPort);
    setDraftPort("");
    setShowAddRow(false);
  };

  const handleDeletePort = async (port: number) => {
    setPendingDeletePort(port);
    setLocalError(null);
    try {
      await onUntrackPort(port);
    } finally {
      setPendingDeletePort(null);
    }
  };

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
        <TouchableOpacity
          onPress={() => {
            setShowAddRow((current) => !current);
            setLocalError(null);
          }}
          activeOpacity={0.85}
          style={{
            height: 28,
            paddingHorizontal: 10,
            borderRadius: radius.full,
            backgroundColor: showAddRow ? colors.accent.default : colors.bg.base,
            borderWidth: showAddRow ? 0 : 1,
            borderColor: colors.bg.raised,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Plus size={13} color={showAddRow ? "#ffffff" : colors.fg.default} strokeWidth={2} />
          <Text
            style={{
              color: showAddRow ? "#ffffff" : colors.fg.default,
              fontSize: 10,
              fontFamily: fonts.sans.semibold,
            }}
          >
            Add Port
          </Text>
        </TouchableOpacity>

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

      {showAddRow ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            padding: 10,
            borderRadius: radius.lg,
            backgroundColor: colors.bg.raised,
          }}
        >
          <TextInput
            value={draftPort}
            onChangeText={(value) => {
              setDraftPort(value.replace(/[^0-9]/g, ""));
              if (localError) setLocalError(null);
            }}
            onSubmitEditing={() => {
              void handleAddPort();
            }}
            placeholder="Port"
            placeholderTextColor={colors.fg.subtle}
            keyboardType="number-pad"
            style={{
              flex: 1,
            height: 36,
            color: colors.fg.default,
            fontSize: 11,
            fontFamily: fonts.mono.regular,
            paddingHorizontal: 10,
            borderRadius: radius.md,
            backgroundColor: colors.bg.base,
            borderWidth: 1,
            borderColor: colors.border.secondary,
          }}
        />

          <TouchableOpacity
            onPress={() => {
              void handleAddPort();
            }}
            disabled={isSubmitting}
            activeOpacity={0.85}
            style={{
              height: 30,
              paddingHorizontal: 12,
              borderRadius: radius.full,
              backgroundColor: isSubmitting ? colors.bg.base : colors.accent.default,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              borderWidth: isSubmitting ? 1 : 0,
              borderColor: colors.border.secondary,
            }}
          >
            <Text
              style={{
                color: isSubmitting ? colors.fg.muted : "#ffffff",
                fontSize: 10,
                fontFamily: fonts.sans.semibold,
              }}
            >
              Save
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowAddRow(false);
              setDraftPort("");
              setLocalError(null);
            }}
            activeOpacity={0.85}
            style={{
              width: 30,
              height: 30,
              borderRadius: radius.full,
              backgroundColor: colors.bg.base,
              borderWidth: 1,
              borderColor: colors.border.secondary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={13} color={colors.fg.default} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      ) : null}

      <Text
        style={{
          color: localError || error ? "#ef4444" : colors.fg.subtle,
          fontSize: 10,
          lineHeight: 14,
          fontFamily: fonts.sans.regular,
        }}
      >
        {localError || error || "Tracked ports are shared across all tabs and open on phone localhost once the CLI reports them live."}
      </Text>

      <View
        style={{
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.border.secondary,
          }}
        >
          <Text
            style={{
              flex: 1.1,
              color: colors.fg.subtle,
              fontSize: 9,
              fontFamily: fonts.sans.medium,
              textTransform: "uppercase",
            }}
          >
            Port
          </Text>
          <Text
            style={{
              flex: 1,
              color: colors.fg.subtle,
              fontSize: 9,
              fontFamily: fonts.sans.medium,
              textTransform: "uppercase",
            }}
          >
            Status
          </Text>
          <Text
            style={{
              width: 36,
              color: colors.fg.subtle,
              fontSize: 9,
              fontFamily: fonts.sans.medium,
              textTransform: "uppercase",
              textAlign: "right",
            }}
          >
            Del
          </Text>
        </View>

        {sortedTrackedPorts.length === 0 ? (
          <View style={{ paddingHorizontal: 10, paddingVertical: 14 }}>
            <Text
              style={{
                color: colors.fg.muted,
                fontSize: 11,
                fontFamily: fonts.sans.regular,
              }}
            >
              No tracked ports yet.
            </Text>
          </View>
        ) : (
          sortedTrackedPorts.map((port, index) => {
            const isOpen = openPortSet.has(port);
            const isDeleting = pendingDeletePort === port;

            return (
              <View
                key={port}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderBottomWidth: index === sortedTrackedPorts.length - 1 ? 0 : 1,
                  borderBottomColor: colors.border.secondary,
                }}
              >
                <Text
                  style={{
                    flex: 1.1,
                    color: colors.fg.default,
                    fontSize: 11,
                    fontFamily: fonts.mono.medium,
                  }}
                >
                  {port}
                </Text>

                <Text
                  style={{
                    flex: 1,
                    color: isOpen ? colors.accent.default : colors.fg.muted,
                    fontSize: 10,
                    fontFamily: fonts.sans.semibold,
                  }}
                >
                  {isOpen ? "Live" : "Waiting"}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    void handleDeletePort(port);
                  }}
                  disabled={isDeleting}
                  activeOpacity={0.85}
                  style={{
                    width: 36,
                    alignItems: "flex-end",
                    justifyContent: "center",
                    opacity: isDeleting ? 0.5 : 1,
                  }}
                >
                  <Trash2 size={14} color="#ef4444" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}
