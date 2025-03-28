export const websiteURL = 'Quran.AbuSofiya.com';

export const websiteTagline = 'Terjemahan Kata Demi Kata, Transliterasi Dan Morfologi';

export const websiteTitle = `Quran ${websiteTagline} - ${websiteURL}`;

export const wbwLanguages = 'Indonesian, English, Urdu, Hindi, Bangla, Turkish, Tamil, French, German, Chinese, Malayalam, Divehi, Sindhi, Persian and Albanian';

export const apiVersion = 137;

export const useLocalAPI = false;

export const apiByPassCache = false; // If true, api response will not be cached by Cloudflare

export const apiEndpoint = useLocalAPI ? 'http://localhost:7500/v1' : 'https://api.quranwbw.com/v1';

export const staticEndpoint = 'https://static.quranwbw.com/data/v4';

export const wordsAudioURL = 'https://audios.quranwbw.com/words';

export const mushafFontVersion = 7;

export const mushafWordFontLink = `${staticEndpoint}/fonts/Hafs/KFGQPC-v4/COLRv1`;

export const mushafHeaderFontLink = `${staticEndpoint}/fonts/Extras/chapter-headers/QCF_SurahHeader_COLOR-Regular.woff2`;

export const errorLoadingDataMessage = 'Maaf, terjadi kesalahan saat memuat data. Harap segarkan halaman dan coba lagi.';

export const splitDelimiter = '||';
