export interface Language {
  _key: string;
  title: string;
  id: string;
  icon: string;
  default?: boolean;
}

export const languages: Language[] = [
  {
    _key: "bn-key",
    title: "বাংলা", // Bengali in Bengali
    id: "bn",
    icon: "🇧🇩",
    default: false,
  },
  {
    _key: "en-key",
    title: "English", // English in English
    id: "en",
    icon: "🇬🇧",
    default: false,
  },
  {
    _key: "fr-key",
    title: "Français", // French in French
    id: "fr",
    icon: "🇫🇷",
    default: false,
  },
  {
    _key: "de-key",
    title: "Deutsch", // German in German
    id: "de",
    icon: "🇩🇪",
    default: false,
  },
  {
    _key: "hi-key",
    title: "हिन्दी", // Hindi in Hindi
    id: "hi",
    icon: "🇮🇳",
    default: false,
  },
  {
    _key: "id-key",
    title: "Bahasa Indonesia", // Indonesian in Indonesian
    id: "id",
    icon: "🇮🇩",
    default: false,
  },
  {
    _key: "it-key",
    title: "Italiano", // Italian in Italian
    id: "it",
    icon: "🇮🇹",
    default: false,
  },
  {
    _key: "ja-key",
    title: "日本語", // Japanese in Japanese
    id: "ja",
    icon: "🇯🇵",
    default: false,
  },
  {
    _key: "ko-key",
    title: "한국어", // Korean in Korean
    id: "ko",
    icon: "🇰🇷",
    default: false,
  },
  {
    _key: "zh-key",
    title: "中文", // Mandarin Chinese in Chinese
    id: "zh",
    icon: "🇨🇳",
    default: false,
  },
  {
    _key: "mr-key",
    title: "मराठी", // Marathi in Marathi
    id: "mr",
    icon: "🇮🇳",
    default: false,
  },
  {
    _key: "ar-key",
    title: "العربية", // Modern Standard Arabic in Arabic
    id: "ar",
    icon: "🇸🇦",
    default: false,
  },
  {
    _key: "no-key",
    title: "Norsk", // Norwegian in Norwegian
    id: "no",
    icon: "🇳🇴",
    default: false,
  },
  {
    _key: "pt-key",
    title: "Português", // Portuguese in Portuguese
    id: "pt",
    icon: "🇵🇹",
    default: false,
  },
  {
    _key: "ru-key",
    title: "Русский", // Russian in Russian
    id: "ru",
    icon: "🇷🇺",
    default: false,
  },
  {
    _key: "es-key",
    title: "Español", // Spanish in Spanish
    id: "es",
    icon: "🇪🇸",
    default: false,
  },
  {
    _key: "sw-key",
    title: "Kiswahili", // Swahili in Swahili
    id: "sw",
    icon: "🇰🇪",
    default: false,
  },
  {
    _key: "se-key",
    title: "Svenska", // Swedish in Swedish
    id: "se",
    icon: "🇸🇪",
    default: false,
  },
  {
    _key: "ta-key",
    title: "தமிழ்", // Tamil in Tamil
    id: "ta",
    icon: "🇮🇳",
    default: false,
  },
  {
    _key: "te-key",
    title: "తెలుగు", // Telugu in Telugu
    id: "te",
    icon: "🇮🇳",
    default: false,
  },
  {
    _key: "tr-key",
    title: "Türkçe", // Turkish in Turkish
    id: "tr",
    icon: "🇹🇷",
    default: false,
  },
  {
    _key: "ur-key",
    title: "اردو", // Urdu in Urdu
    id: "ur",
    icon: "🇵🇰",
    default: false,
  },
];

export const defaultLanguage = languages.find((lang) => lang.default) || {
  id: "no",
};

export function getLanguageById(id: string) {
  return languages.find((lang) => lang.id === id);
}
