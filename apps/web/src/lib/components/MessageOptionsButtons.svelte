<script>
	import Check from '$lib/components/icons/Check.svelte';
	import Square2Stack from '$lib/components/icons/Square2Stack.svelte';
	import Trash from '$lib/components/icons/Trash.svelte';
	import clsx from 'clsx';

	/** @type {Message} */
	export let message;
	export let reverse = false;
	export let showCheck = false;
	/** @type {function(Message): Promise<void>} */
	export let onDeleteMessage;
</script>

<div class="invisible group-hover:visible">
	<div class={clsx('flex items-center gap-1', { 'flex-row-reverse': reverse })}>
		<button on:click={() => onDeleteMessage(message)} class="btn btn-square btn-ghost btn-xs"
			><Trash /></button
		>
		<button
			on:click={async () => {
				await navigator.clipboard.writeText(message.content);
				showCheck = true;
				setTimeout(() => {
					showCheck = false;
				}, 1000);
			}}
			class="btn btn-square btn-ghost btn-xs"
			>{#if showCheck}<Check />{:else}<Square2Stack />{/if}</button
		>
	</div>
</div>
