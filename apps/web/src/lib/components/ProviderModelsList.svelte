<script>
	import dayjs from 'dayjs';
	import calendar from 'dayjs/plugin/calendar';
	import isEqual from 'lodash.isequal';
	import ChevronDown from './icons/ChevronDown.svelte';
	dayjs.extend(calendar);

	/** @type {Provider[]} */
	const PROVIDERS = ['Local', 'Anthropic', 'OpenAI'];

	/** @type {Model | null}*/
	export let currentModel;
	/** @type {boolean} */
	export let loading;
	/** @type {ProviderModels | null} */
	export let providerModels;
	/** @type {function(Model): void} */
	export let onModelChange;

	/** @param {Model} model */
	async function onClickModel(model) {
		onModelChange(model);
		/** @type {*} */ (document.activeElement)?.blur?.();
	}

	$: currentModelName = currentModel?.name ?? 'Select a model';
</script>

<div tabindex="0" role="button" class="btn btn-sm mx-2">
	<ChevronDown />

	{currentModelName}
	{#if loading && !currentModel}
		<span class="loading"></span>
	{/if}
</div>
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
	tabindex="0"
	class="dropdown-content rounded-box bg-base-100 z-10 max-h-96 w-80 overflow-scroll p-2 shadow-2xl"
>
	<ul class="menu">
		{#each PROVIDERS as provider}
			{@const { models, error } = providerModels?.[provider] ?? { models: [] }}
			<li>
				<h3 class="menu-title text-base-content">{provider}</h3>
				{#if models.length === 0 || error}
					<a class="flex flex-col items-start" href="/settings">
						{#if models.length === 0}
							<p>No <span class="font-bold">{provider}</span> models found.</p>
						{/if}
						{#if error}
							<p class="text-error">{error}</p>
						{/if}
					</a>
				{/if}
				<ul>
					{#each models as model}
						<li>
							<label class="label cursor-pointer">
								<span>{model.name}</span>
								<input
									on:click={() => onClickModel(model)}
									type="radio"
									class="radio radio-sm"
									checked={isEqual(currentModel, model)}
								/>
							</label>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</div>
