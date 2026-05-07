import Loading from "@/components/Loading";
import PluginBottomBar from "@/components/PluginBottomBar";
import PluginRenderer from "@/components/PluginRenderer";
import { useConnection } from "@/contexts/ConnectionContext";
import { useTheme } from "@/contexts/ThemeContext";
import { logger } from "@/lib/logger";
import { usePlugins } from "@/plugins";
import { useFocusEffect, useRouter } from "expo-router";
import { useDrawerStatus } from "@react-navigation/drawer";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Platform,
  Text,
  View,
} from "react-native";


export default function WorkspaceScreen() {
  const { colors } = useTheme();
  const { isLoading, openTab, setActiveTab } = usePlugins();
  const { status, sessionState, error, isReconnecting, interactionBlockReason, disconnect } = useConnection();
  const router = useRouter();
  const drawerStatus = useDrawerStatus();

  const [bottomBarHeight, setBottomBarHeight] = useState(0);
  const prevSessionStateRef = useRef(sessionState);
  const reconnectAttemptVisibleRef = useRef(false);
  const reconnectFailureAlertVisibleRef = useRef(false);
  const showConnectionNotice = status === "connecting" || isReconnecting || interactionBlockReason !== null;

  const handleGoHome = useCallback(() => {
    logger.info("workspace", "navigating back to auth after disconnect");
    router.replace("/auth");
    disconnect();
  }, [disconnect, router]);

  useEffect(() => {
    const prev = prevSessionStateRef.current;
    prevSessionStateRef.current = sessionState;

    logger.info("workspace", "screen state updated", {
      prevSessionState: prev,
      status,
      sessionState,
      error,
      isLoading,
      drawerStatus,
    });

    if (prev !== sessionState && (sessionState === "ended" || sessionState === "expired" || sessionState === "cli_offline_grace")) {
      Alert.alert(
        'Connection Lost',
        'Your session was disconnected. Run npx lunel-cli again to reconnect.',
        [{ text: 'Home', style: 'destructive', onPress: handleGoHome }],
        { cancelable: false }
      );
    }
  }, [drawerStatus, error, handleGoHome, isLoading, sessionState, status]);

  useEffect(() => {
    if (isLoading) {
      logger.info("workspace", "rendering loading spinner", { status, error });
      return;
    }

    logger.info("workspace", "workspace shell ready", { status, error });
  }, [isLoading, status, error]);

  useEffect(() => {
    const isReconnectingNow = status === "connecting" || isReconnecting || interactionBlockReason !== null;
    if (isReconnectingNow) {
      reconnectAttemptVisibleRef.current = true;
      reconnectFailureAlertVisibleRef.current = false;
      return;
    }

    if (reconnectAttemptVisibleRef.current && status !== "connected" && error && !reconnectFailureAlertVisibleRef.current) {
      reconnectFailureAlertVisibleRef.current = true;
      Alert.alert(
        "Session Disconnected",
        "Automatic reconnect failed. Go home and reconnect to your session.",
        [
          { text: "Go Home", style: "destructive", onPress: handleGoHome },
        ],
        { cancelable: false }
      );
    }

    if (!isReconnectingNow) {
      reconnectAttemptVisibleRef.current = false;
    }
  }, [error, handleGoHome, interactionBlockReason, isReconnecting, status]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") return;

      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        // Keep users in workspace; let default behavior close the drawer if open.
        if (drawerStatus === "open") return false;
        return true;
      });

      return () => sub.remove();
    }, [drawerStatus])
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg.base }}>
        <Loading color={colors.accent.default} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.base }}>
      <PluginRenderer paddingBottom={0} bottomBarHeight={bottomBarHeight} />
      <View onLayout={(e) => setBottomBarHeight(e.nativeEvent.layout.height)}>
        <PluginBottomBar
          openTab={openTab}
          setActiveTab={setActiveTab}
        />
      </View>
      {showConnectionNotice ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            minHeight: 24,
            paddingHorizontal: 12,
            paddingVertical: 4,
            backgroundColor: colors.bg.raised,
            borderBottomWidth: 1,
            borderBottomColor: colors.border.default,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
            elevation: 20,
          }}
        >
          <Text
            style={{
              color: colors.fg.muted,
              fontSize: 12,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {interactionBlockReason === "offline" ? "Offline. Waiting for connection..." : "Reconnecting..."}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
