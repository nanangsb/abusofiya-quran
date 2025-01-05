<script>
	export let key;

	import Spinner from '$svgs/Spinner.svelte';
	import { fetchChapterData } from '$utils/fetchData';
	import { __fontType } from '$utils/stores';

	$: [chapter, verse] = key.split(':').map(Number);
	$: fontType = [1, 2, 3].includes($__fontType) ? 1 : 4;

	$: fetchVerseData = fetchChapterData({
		chapter: chapter,
		fontType: fontType,
		skipSave: true
	});
</script>

{#await fetchVerseData}
	<Spinner size="10" />
{:then data}
	<div class="direction-rtl text-3xl leading-normal arabic-font-{fontType}">
		{data.arabic[verse].words.join(' ')}
		{data.arabic[verse].end}
	</div>
{:catch error}
	<p>error.</p>
{/await}
