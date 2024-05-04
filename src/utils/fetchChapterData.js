import { get } from 'svelte/store';
import { __currentPage, __wordType, __chapterData, __wordTranslation, __verseTranslations } from '$utils/stores';
import { apiEndpoint } from '$data/websiteSettings';
import { quranMetaData } from '$data/quranMeta';

// QuranWBW.com always loads the complete chapter data rather than verses on demand (like Quran.com)
// though the initial loading time might be higher, but for the subsequent visits it will be lower and we get some benefits like:
// - the whole chapter and all its verses can be viewed without ever making another request to the API (eg: /2 or /2/255) unless there'a a change in settings
// - offline capabilities
// Other option would be to load the few initial verses on page load and then the complete data for faster loading times, might think about it later.
export async function fetchChapterData(chapter, download = false) {
	const apiURL =
		apiEndpoint +
		new URLSearchParams({
			verses: `${chapter}:1,${chapter}:${quranMetaData[chapter].verses}`,
			word_type: get(__wordType),
			word_translation: get(__wordTranslation),
			verse_translation: get(__verseTranslations).toString(),
			between: true
		});

	// if the user is on homepage, just fetch the chapter data
	if (get(__currentPage) === 'home') return fetch(apiURL);

	// if the user is on the chapter page, fetch and set the data in store
	const response = await fetch(apiURL);
	const data = await response.json();

	// download = true means that we are just fetching api data without updating the __chapterData store (for downloadData)
	if (download === false) __chapterData.set(data.data.verses);
}

// function to fetch individual verses
export async function fetchVersesData(verses, wordType, wordTranslation, verseTranslations) {
	const apiURL =
		apiEndpoint +
		new URLSearchParams({
			verses: verses,
			word_type: wordType,
			word_translation: wordTranslation,
			verse_translation: verseTranslations
		});

	const response = await fetch(apiURL);
	const data = await response.json();
	return data.data.verses;
}
