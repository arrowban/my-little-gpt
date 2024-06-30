<script>
	import { sleep } from 'openai/core.mjs';
	import { onMount } from 'svelte';

	const prefix = 'Welcome to ';
	const bold = 'My Little GPT';
	const suffix = ', a simple AI assistant.';

	let prefixStr = '';
	let boldStr = '';
	let suffixStr = '';

	onMount(() => {
		let prefixIndex = 0;
		let boldIndex = 0;
		let suffixIndex = 0;

		(async () => {
			while (
				prefixIndex < prefix.length ||
				boldIndex < bold.length ||
				suffixIndex < suffix.length
			) {
				await sleep(40);
				if (prefixIndex < prefix.length) {
					prefixStr += prefix[prefixIndex];
					prefixIndex++;
				} else if (boldIndex < bold.length) {
					boldStr += bold[boldIndex];
					boldIndex++;
				} else if (suffixIndex < suffix.length) {
					suffixStr += suffix[suffixIndex];
					suffixIndex++;
					if (suffixIndex === 1) {
						await sleep(200);
					}
				}
			}
		})();
	});
</script>

<p class="text-center">
	{prefixStr}<span class="text-xl font-bold">{boldStr}</span>{suffixStr}
</p>
