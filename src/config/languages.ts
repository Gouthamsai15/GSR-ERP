export type SupportedLanguage = {
  code: string;
  label: string;
  nativeLabel: string;
  translateCode?: string;
  supported: boolean;
};

export const DEFAULT_LANGUAGE_CODE = "en";

export const INDIAN_LANGUAGE_OPTIONS: SupportedLanguage[] = [
  { code: "en", translateCode: "en", label: "English", nativeLabel: "English", supported: true },
  { code: "hi", translateCode: "hi", label: "Hindi", nativeLabel: "हिन्दी", supported: true },
  { code: "bn", translateCode: "bn", label: "Bengali", nativeLabel: "বাংলা", supported: true },
  { code: "te", translateCode: "te", label: "Telugu", nativeLabel: "తెలుగు", supported: true },
  { code: "mr", translateCode: "mr", label: "Marathi", nativeLabel: "मराठी", supported: true },
  { code: "ta", translateCode: "ta", label: "Tamil", nativeLabel: "தமிழ்", supported: true },
  { code: "ur", translateCode: "ur", label: "Urdu", nativeLabel: "اردو", supported: true },
  { code: "gu", translateCode: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી", supported: true },
  { code: "kn", translateCode: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ", supported: true },
  { code: "ml", translateCode: "ml", label: "Malayalam", nativeLabel: "മലയാളം", supported: true },
  { code: "or", translateCode: "or", label: "Odia", nativeLabel: "ଓଡ଼ିଆ", supported: true },
  { code: "pa", translateCode: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ", supported: true },
  { code: "as", translateCode: "as", label: "Assamese", nativeLabel: "অসমীয়া", supported: true },
  { code: "ne", translateCode: "ne", label: "Nepali", nativeLabel: "नेपाली", supported: true },
];

export const LANGUAGE_STORAGE_KEY = "inddia-erp-language";
