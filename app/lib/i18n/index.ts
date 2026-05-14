import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import fr from './locales/fr.json';

export const LANGUAGE_KEY = '@lunel_language';
export const SUPPORTED_LANGUAGES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'de', 'fr'] as const;
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
    ja: { translation: ja },
    ko: { translation: ko },
    es: { translation: es },
    pt: { translation: pt },
    de: { translation: de },
    fr: { translation: fr },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
