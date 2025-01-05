import { get } from 'svelte/store';
import { __fontType, __chapterData, __verseTranslationData, __wordTranslation, __wordTransliteration, __verseTranslations, __timestampData } from '$utils/stores';
import { apiEndpoint, staticEndpoint, apiVersion, apiByPassCache } from '$data/websiteSettings';
import { selectableFontTypes } from '$data/options';

// Fetch specific verses (startVerse to endVerse) and then fetch the complete chapter data to be cached by the user's browser
// export async function fetchChapterData(props) {
// 	__chapterData.set(null);
// 	const fontType = get(__fontType);
// 	const wordTranslation = get(__wordTranslation);
// 	const wordTransliteration = get(__wordTransliteration);

// 	const apiURL =
// 		`${apiEndpoint}/chapter?` +
// 		new URLSearchParams({
// 			chapter: props.chapter,
// 			word_type: selectableFontTypes[fontType].apiId,
// 			word_translation: wordTranslation,
// 			word_transliteration: wordTransliteration,
// 			verse_translation: '1,3',
// 			version: apiVersion,
// 			bypass_cache: apiByPassCache
// 		});

// 	// Fetch and set the data in store if the user is on the chapter page
// 	const response = await fetch(apiURL);
// 	const data = await response.json();

// 	// 'skipSave' = true means we are just fetching API data without updating the __chapterData store (for downloadData)
// 	if (!props.skipSave) __chapterData.set(data.data.verses);
// 	return data.data.verses;
// }

// Get verse translations from Quran.com's API as a separate request compared to the rest of the verse data (from our API)
export async function fetchVerseTranslationData(chapter, translations = get(__verseTranslations).toString()) {
	__verseTranslationData.set(null);

	const apiURL =
		`https://api.qurancdn.com/api/qdc/verses/by_chapter/${chapter}?` +
		new URLSearchParams({
			per_page: 286,
			translations: translations
		});

	const response = await fetch(apiURL);
	const data = await response.json();
	__verseTranslationData.set(data.verses);
	return data.verses;
}

// Fetch individual verses
export async function fetchVersesData(props) {
	if (!props.skipSave) __chapterData.set(null);

	// Set default props, we still try to get the props from function invokations for reactivity
	if (!props.fontType) props.fontType = get(__fontType);
	if (!props.wordTranslation) props.wordTranslation = get(__wordTranslation);
	if (!props.wordTransliteration) props.wordTransliteration = get(__wordTransliteration);

	const apiURL =
		`${apiEndpoint}/verses?` +
		new URLSearchParams({
			verses: props.verses,
			word_type: selectableFontTypes[props.fontType].apiId,
			word_translation: props.wordTranslation,
			word_transliteration: props.wordTransliteration,
			verse_translation: '1,3',
			version: apiVersion,
			bypass_cache: apiByPassCache
		});

	const response = await fetch(apiURL);
	const data = await response.json();
	if (!props.skipSave) __chapterData.set(data.data.verses);
	return data.data.verses;
}

// Fetch timestamps for word-by-word highlighting
export async function fetchTimestampData(chapter) {
	const apiURL = `${staticEndpoint}/timestamps/${chapter}.json?version=1`;
	const response = await fetch(apiURL);
	const data = await response.json();
	__timestampData.set(data);
}

// Function to fetch Arabic data
async function fetchArabicData(chapter, arabicId) {
	const url = `https://static.quranwbw.com/data/v4/chapters/${chapter}/word-data/arabic/${arabicId}.json?bypass_cache=true`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}

// Function to fetch Translation data
async function fetchTranslationData(chapter, translationId) {
	const url = `https://static.quranwbw.com/data/v4/chapters/${chapter}/word-data/translation/${translationId}.json?bypass_cache=true`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}

// Function to fetch Transliteration data
async function fetchTransliterationData(chapter, transliterationId) {
	const url = `https://static.quranwbw.com/data/v4/chapters/${chapter}/word-data/transliteration/${transliterationId}.json?bypass_cache=true`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}

// Function to fetch Transliteration data
async function fetchMetaData(chapter) {
	const url = `https://static.quranwbw.com/data/v4/chapters/${chapter}/word-data/meta/meta.json?bypass_cache=true`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}

// Main function to fetch all chapter data concurrently
export async function fetchChapterData(props) {
	try {
		const fontType = get(__fontType);
		const wordTranslation = get(__wordTranslation);
		const wordTransliteration = get(__wordTransliteration);

		// Create an array of fetch promises for each data type
		const fetchPromises = [fetchMetaData(props.chapter), fetchArabicData(props.chapter, fontType), fetchTranslationData(props.chapter, wordTranslation), fetchTransliterationData(props.chapter, wordTransliteration)];

		// Wait for all the promises to resolve using Promise.all
		const [metaData, arabicData, translationData, transliterationData] = await Promise.all(fetchPromises);

		const wordsData = {
			meta: metaData.data,
			arabic: arabicData.data,
			translation: translationData.data,
			transliteration: transliterationData.data
		};

		__chapterData.set(wordsData);
		return wordsData;
	} catch (error) {
		console.error('Error fetching chapter data:', error);
	}
}
