<script>
	export let key, value;

	import VerseOptionButtons from '$display/verses/VerseOptionButtons.svelte';
	import WordsBlock from '$display/verses/WordsBlock.svelte';
	import Translations from '$display/verses/translations/Translations.svelte';
	import PageDivider from '$display/verses/PageDivider.svelte';
	import { updateSettings } from '$utils/updateSettings';
	import { inview } from 'svelte-inview';
</script>

{#if value}
	{@const verseMetaData = value.meta[key.split(':')[1]].meta}

	<!-- show page number  -->
	<PageDivider {key} page={verseMetaData.page} />

	<div id={key} class="verse flex flex-col py-8 space-y-8 verse-{verseMetaData.chapter}-{verseMetaData.verse}" data-words={verseMetaData.words} data-page={verseMetaData.page} data-juz={verseMetaData.juz} use:inview on:inview_enter={(event) => updateSettings({ type: 'lastRead', value: { key, page: verseMetaData.page } })}>
		<VerseOptionButtons {key} {value} />

		<!-- words -->
		<div class="flex flex-row-reverse flex-wrap">
			<WordsBlock {key} {value} />
		</div>

		<!-- verse translations and transliterations -->
		<Translations {key} {value} />
	</div>

	<div class="border-b {window.theme('border')}"></div>
{/if}
