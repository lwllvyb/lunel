import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowRight, FileCode2, RefreshCw, Search, TriangleAlert } from 'lucide-react-native';
import PluginHeader, { usePluginHeaderHeight } from '@/components/PluginHeader';
import Loading from '@/components/Loading';
import NotConnected from '@/components/NotConnected';
import { useTheme } from '@/contexts/ThemeContext';
import { useApi, ApiError, GrepMatch } from '@/hooks/useApi';
import { usePlugins } from '@/plugins';
import { gPI } from '../../gpi';
import { PluginPanelProps } from '../../types';

function SearchPanel({ isActive }: PluginPanelProps) {
  const { colors, fonts, spacing, radius } = useTheme();
  const headerHeight = usePluginHeaderHeight();
  const { fs, isConnected } = useApi();
  const { openTab } = usePlugins();

  const [query, setQuery] = useState('');
  const [searchPath, setSearchPath] = useState('.');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [results, setResults] = useState<GrepMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const canSearch = query.trim().length > 0 && searchPath.trim().length > 0;

  const runSearch = useCallback(async () => {
    const trimmedQuery = query.trim();
    const trimmedPath = searchPath.trim() || '.';
    if (!trimmedQuery) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const matches = await fs.grep(trimmedQuery, trimmedPath, {
        caseSensitive,
        maxResults: 200,
      });
      setResults(matches);
    } catch (err) {
      setResults([]);
      setError(err instanceof ApiError ? err.message : 'Failed to search the codebase');
    } finally {
      setLoading(false);
    }
  }, [caseSensitive, fs, query, searchPath]);

  const openMatch = useCallback(async (match: GrepMatch) => {
    await gPI.editor.openFile(match.file);
    openTab('editor');
  }, [openTab]);

  const subtitle = useMemo(() => {
    if (!hasSearched) return 'Search your workspace without leaving the app.';
    if (loading) return 'Searching...';
    if (results.length === 0) return 'No matches found.';
    return `${results.length} match${results.length === 1 ? '' : 'es'} found.`;
  }, [hasSearched, loading, results.length]);

  if (!isConnected) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg.base, paddingTop: headerHeight }}>
        <PluginHeader title="Search" colors={colors} />
        <NotConnected colors={colors} fonts={fonts} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.base, paddingTop: headerHeight }}>
      <PluginHeader
        title="Search"
        colors={colors}
        rightAccessory={
          <TouchableOpacity
            onPress={() => { if (canSearch && !loading) void runSearch(); }}
            style={{ padding: 8, opacity: canSearch && !loading ? 1 : 0.4 }}
            disabled={!canSearch || loading}
          >
            <RefreshCw size={20} color={colors.fg.muted} strokeWidth={2} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing[4],
          paddingTop: spacing[4],
          paddingBottom: spacing[6],
          gap: spacing[4],
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            backgroundColor: colors.bg.raised,
            borderRadius: radius.xl,
            padding: spacing[4],
            gap: spacing[3],
          }}
        >
          <Text style={{ color: colors.fg.default, fontFamily: fonts.sans.semibold, fontSize: 16 }}>
            Codebase Search
          </Text>
          <Text style={{ color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: 13 }}>
            {subtitle}
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.fg.muted, fontFamily: fonts.sans.medium }]}>
              Pattern
            </Text>
            <View style={[styles.inputShell, { backgroundColor: colors.bg.base, borderColor: colors.border.secondary, borderRadius: radius.lg }]}>
              <Search size={16} color={colors.fg.subtle} strokeWidth={2} />
              <TextInput
                style={[styles.input, { color: colors.fg.default, fontFamily: fonts.mono.regular }]}
                placeholder="function handleFsGrep"
                placeholderTextColor={colors.fg.subtle}
                value={query}
                onChangeText={setQuery}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={() => { if (canSearch && !loading) void runSearch(); }}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.fg.muted, fontFamily: fonts.sans.medium }]}>
              Path
            </Text>
            <View style={[styles.inputShell, { backgroundColor: colors.bg.base, borderColor: colors.border.secondary, borderRadius: radius.lg }]}>
              <ArrowRight size={16} color={colors.fg.subtle} strokeWidth={2} />
              <TextInput
                style={[styles.input, { color: colors.fg.default, fontFamily: fonts.mono.regular }]}
                placeholder="."
                placeholderTextColor={colors.fg.subtle}
                value={searchPath}
                onChangeText={setSearchPath}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: spacing[1],
            }}
          >
            <View>
              <Text style={{ color: colors.fg.default, fontFamily: fonts.sans.medium, fontSize: 14 }}>
                Case sensitive
              </Text>
              <Text style={{ color: colors.fg.subtle, fontFamily: fonts.sans.regular, fontSize: 12 }}>
                Use exact casing while matching
              </Text>
            </View>
            <Switch
              value={caseSensitive}
              onValueChange={setCaseSensitive}
              trackColor={{ false: colors.border.secondary, true: colors.accent.default }}
              thumbColor={colors.bg.base}
            />
          </View>

          <TouchableOpacity
            onPress={() => void runSearch()}
            activeOpacity={0.85}
            disabled={!canSearch || loading}
            style={{
              marginTop: spacing[1],
              height: 44,
              borderRadius: radius.lg,
              backgroundColor: canSearch && !loading ? colors.accent.default : colors.bg.base,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: canSearch && !loading ? 1 : 0.55,
            }}
          >
            <Text
              style={{
                color: canSearch && !loading ? colors.bg.base : colors.fg.muted,
                fontFamily: fonts.sans.semibold,
                fontSize: 14,
              }}
            >
              Search
            </Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[2],
              padding: spacing[3],
              borderRadius: radius.lg,
              backgroundColor: '#ef4444' + '15',
            }}
          >
            <TriangleAlert size={16} color="#ef4444" strokeWidth={2} />
            <Text style={{ flex: 1, color: '#ef4444', fontFamily: fonts.sans.medium, fontSize: 13 }}>
              {error}
            </Text>
          </View>
        ) : null}

        {loading ? (
          <Loading />
        ) : (
          <View style={{ gap: spacing[3] }}>
            {results.map((match, index) => (
              <TouchableOpacity
                key={`${match.file}:${match.line}:${index}`}
                activeOpacity={0.8}
                onPress={() => void openMatch(match)}
                style={{
                  backgroundColor: colors.bg.raised,
                  borderRadius: radius.xl,
                  padding: spacing[4],
                  gap: spacing[2],
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
                  <FileCode2 size={16} color={colors.accent.default} strokeWidth={2} />
                  <Text
                    style={{ flex: 1, color: colors.fg.default, fontFamily: fonts.mono.medium, fontSize: 13 }}
                    numberOfLines={1}
                  >
                    {match.file}:{match.line}
                  </Text>
                </View>
                <Text style={{ color: colors.fg.muted, fontFamily: fonts.mono.regular, fontSize: 12 }}>
                  {match.content}
                </Text>
              </TouchableOpacity>
            ))}

            {hasSearched && !loading && results.length === 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: spacing[8],
                  gap: spacing[2],
                }}
              >
                <Search size={26} color={colors.fg.subtle} strokeWidth={1.8} />
                <Text style={{ color: colors.fg.muted, fontFamily: fonts.sans.medium, fontSize: 14 }}>
                  No matches
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 46,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
    outlineStyle: 'none',
  } as any,
});

export default memo(SearchPanel);
