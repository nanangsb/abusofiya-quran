<script>
	import PageHead from '$misc/PageHead.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import articles from '../articles.json';

	let content = '';
	let meta;

	onMount(async () => {
		const { slug } = $page.params;
		meta = articles.find((a) => a.slug === slug);

		if (meta) {
			const mdModules = import.meta.glob('../mds/*.md', { as: 'raw' });
			const mdPath = `../mds/${meta.slug}.md`;
			if (mdModules[mdPath]) {
				content = marked.parse(await mdModules[mdPath]());
			} else {
				content = '<p>Markdown file not found.</p>';
			}
		} else {
			content = '<p>Article not found.</p>';
		}
	});
</script>

{#if meta}
	<PageHead title={meta.title} />

	<div class="markdown mx-auto">
		{@html content}
	</div>
{:else}
	<h1>Article not found</h1>
{/if}
