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

<h1>Articles</h1>
<div>
	{#each articleList as article}
		<div>
			<a href={`/articles/${article.slug}`}>
				<h2>{article.title}</h2>
			</a>
		</div>
	{/each}
</div>
