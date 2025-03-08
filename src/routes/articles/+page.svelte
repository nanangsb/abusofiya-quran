<script>
	import { onMount } from 'svelte';
	import { __currentPage } from '$utils/stores';
	import articles from './articles.json';

	let articleList = [];

	__currentPage.set('articles');

	onMount(() => {
		articleList = articles;
	});
</script>

<div>
	{#each articleList as article}
		<div class="flex flex-col space-y-2 border-b py-4">
			<a href={`/articles/${article.slug}`}>
				<h2 class="text-xl">{article.title}</h2>
			</a>

			<div class="flex flex-row space-x-4 opacity-70">
				<div class="text-xs">Posted by {article.author} on {article.date}</div>
			</div>
		</div>
	{/each}
</div>
