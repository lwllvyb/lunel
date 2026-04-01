import { useTheme } from "@/contexts/ThemeContext";
import { Check, ChevronLeft, Star } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FEEDBACK_ENDPOINT = "https://internal-api.lunel.dev/app/feedback";

function RatingStars({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (nextRating: number) => void;
}) {
  const { colors, radius, spacing } = useTheme();

  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((value) => {
        const isActive = value <= rating;

        return (
          <TouchableOpacity
            key={value}
            activeOpacity={0.7}
            onPress={() => onChange(value)}
            style={[
              styles.starButton,
              {
                backgroundColor: isActive ? colors.accent.default : colors.bg.raised,
                borderColor: isActive ? colors.accent.default : colors.bg.raised,
                borderRadius: radius.lg,
                marginRight: value === 5 ? 0 : spacing[2],
              },
            ]}
          >
            <Star
              size={20}
              strokeWidth={2}
              color={isActive ? colors.bg.base : colors.fg.muted}
              fill={isActive ? colors.bg.base : "transparent"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function FeedbackPage() {
  const { colors, fonts, radius, spacing } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const canSend = !isSubmitting && rating > 0 && content.trim().length > 0;

  async function handleSend() {
    if (!canSend) {
      if (rating === 0) {
        setError("Choose a rating.");
        return;
      }

      if (content.trim().length === 0) {
        setError("Describe your feedback.");
      }

      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(FEEDBACK_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          content: content.trim(),
          email: email.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Feedback request failed: ${response.status}`);
      }

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsSent(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to send feedback.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRatingChange(nextRating: number) {
    setRating(nextRating);
    if (error) {
      setError("");
    }
  }

  function handleContentChange(value: string) {
    setContent(value);
    if (error) {
      setError("");
    }
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (error) {
      setError("");
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg.base }]} edges={["top"]}>
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
            Feedback
          </Text>
        </View>
        <View style={[styles.placeholder, { opacity: 0 }]} />
      </View>

      {isSent ? (
        <View style={styles.sentState}>
          <View
            style={[
              styles.sentIconWrap,
              {
                backgroundColor: colors.accent.default,
                borderRadius: radius.full,
              },
            ]}
          >
            <Check size={34} color={colors.bg.base} strokeWidth={2.5} />
          </View>
          <Text style={[styles.sentTitle, { color: colors.fg.default, fontFamily: fonts.sans.semibold }]}>
            Sent
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
          <View style={[styles.pageSection, { marginHorizontal: 16 }]}>
            <View style={styles.introBlock}>
              <Text style={[styles.introTitle, { color: colors.fg.default, fontFamily: fonts.sans.semibold }]}>
                Tell us what to improve
              </Text>
            </View>

            <View style={styles.fieldGroup}>
              <View
                style={[
                  styles.fieldCard,
                  {
                    backgroundColor: colors.bg.raised,
                    borderColor: colors.bg.raised,
                    borderRadius: radius.lg,
                  },
                ]}
              >
                <TextInput
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="Email (optional)"
                  placeholderTextColor={colors.fg.subtle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  style={[styles.input, { color: colors.fg.default, fontFamily: fonts.sans.regular }]}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <View
                style={[
                  styles.fieldCard,
                  {
                    backgroundColor: colors.bg.raised,
                    borderColor: colors.bg.raised,
                    borderRadius: radius.lg,
                  },
                ]}
              >
                <TextInput
                  value={content}
                  onChangeText={handleContentChange}
                  placeholder="Tell us what worked, what broke, or what should improve."
                  placeholderTextColor={colors.fg.subtle}
                  multiline
                  textAlignVertical="top"
                  style={[styles.textarea, { color: colors.fg.default, fontFamily: fonts.sans.regular }]}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <RatingStars rating={rating} onChange={handleRatingChange} />
            </View>
          </View>

          {error ? (
            <Text style={[styles.errorText, { color: colors.git.deleted, fontFamily: fonts.sans.regular }]}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!canSend}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              void handleSend();
            }}
            style={[
              styles.sendButton,
              {
                backgroundColor: canSend ? colors.accent.default : colors.bg.raised,
                borderColor: canSend ? colors.accent.default : colors.bg.raised,
                borderRadius: radius.lg,
                marginHorizontal: 16,
                marginTop: spacing[4],
                opacity: isSubmitting ? 0.8 : 1,
              },
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.bg.base} />
            ) : (
              <Text
                style={[
                  styles.sendButtonLabel,
                  {
                    color: canSend ? colors.bg.base : colors.fg.subtle,
                    fontFamily: fonts.sans.semibold,
                  },
                ]}
              >
                Send
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ height: spacing[8] }} />
        </ScrollView>
      )}
    </SafeAreaView>
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
  placeholder: {
    width: 45,
    height: 45,
  },
  content: {
    flex: 1,
  },
  pageSection: {
    paddingTop: 24,
  },
  introBlock: {
    marginBottom: 8,
  },
  introTitle: {
    fontSize: 16,
  },
  fieldGroup: {
    marginTop: 10,
  },
  fieldCard: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    fontSize: 15,
    minHeight: 20,
    paddingVertical: 0,
  },
  textarea: {
    fontSize: 15,
    minHeight: 132,
    paddingVertical: 0,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  starButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  errorText: {
    fontSize: 13,
    marginHorizontal: 16,
    marginTop: 14,
  },
  sendButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  sendButtonLabel: {
    fontSize: 16,
  },
  sentState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  sentIconWrap: {
    width: 84,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  sentTitle: {
    fontSize: 24,
  },
});
