import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import zh from './locales/zh.json';

export const LANGUAGE_KEY = '@lunel_language';
export const SUPPORTED_LANGUAGES = ['en', 'zh'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export async function getStoredLanguage(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
      return stored;
    }
  } catch {}
  const deviceLang = Localization.getLocales()[0]?.languageCode ?? 'en';
  return SUPPORTED_LANGUAGES.includes(deviceLang as SupportedLanguage) ? deviceLang : 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
