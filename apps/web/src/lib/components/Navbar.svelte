<script>
	import ProviderModelsList from '$lib/components/ProviderModelsList.svelte';
	import Bars3 from '$lib/components/icons/Bars3.svelte';
	import PencilSquare from '$lib/components/icons/PencilSquare.svelte';

	/** @type {Model | null} */
	export let currentModel;
	/** @type {boolean} */
	export let loading;
	/** @type {ProviderModels | null} */
	export let providerModels;
	/** @type {function(Model): void} */
	export let onModelChange;
	/** @type {function(): void} */
	export let openNewChat;
</script>

<div class="navbar min-h-14 w-full">
	<div class="flex flex-1 lg:hidden">
		<div class="flex-none">
			<label for="drawer" aria-label="open sidebar" class="btn btn-square btn-ghost btn-sm">
				<Bars3 />
			</label>
		</div>

		<div class="flex-1 px-2 font-semibold">
			<a href="/" class="hidden w-fit items-center gap-1 sm:flex">
				<div class="text-center">My Little GPT</div>
			</a>
		</div>

		<div class="dropdown dropdown-end">
			<ProviderModelsList {currentModel} {loading} {providerModels} {onModelChange} />
		</div>

		<button on:click={openNewChat} class="btn btn-square btn-secondary btn-sm lg:hidden"
			><PencilSquare /></button
		>
	</div>

	<div class="relative hidden flex-1 lg:flex">
		<div class="dropdown dropdown-bottom z-10">
			<ProviderModelsList {currentModel} {loading} {providerModels} {onModelChange} />
		</div>
		<div class="absolute w-full p-2 text-center text-lg font-bold">
			<a href="/">My Little GPT</a>
		</div>
	</div>
</div>
