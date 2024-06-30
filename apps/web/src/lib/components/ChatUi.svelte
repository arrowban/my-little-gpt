<script>
	import MessageOptionsButton from '$lib/components/MessageOptionsButtons.svelte';
	import MyLittleGptMascot from '$lib/components/MyLittleGptMascot.svelte';
	import ArrowLongUp from '$lib/components/icons/ArrowLongUp.svelte';
	import clsx from 'clsx';
	import DOMPurify from 'dompurify';
	import { parse } from 'marked';

	/** @type {HTMLUListElement} */
	export let chatDiv;
	/** @type {string | null} */
	export let chatId;
	/** @type {string} */
	export let input;
	/** @type {boolean} */
	export let loading = false;
	/** @type {Message[]} */
	export let messages = [];
	/** @type {HTMLTextAreaElement} */
	export let textarea;
	/** @type {function(): void} */
	export let autoResize;
	/** @type {function(Message): Promise<void>} */
	export let onDeleteMessage;
	/** @type {function(KeyboardEvent): void} */
	export let onKeypress;
	/** @type {function(Event): void} */
	export let onSubmit;
</script>

<ul bind:this={chatDiv} class="w-full max-w-screen-md flex-1 overflow-scroll px-4 py-2">
	<li class={clsx('flex flex-col items-center justify-between pt-4', { 'h-full': !chatId })}>
		{#if !chatId}
			<div class="flex h-full flex-col items-center justify-center gap-4">
				<MyLittleGptMascot floating lgWhenSm md />
				<div class="text-center">
					<p class="font-bold sm:text-xl">How can I help you today?</p>
				</div>
			</div>
		{/if}
	</li>
	{#each messages as message}
		{#if message.role === 'assistant'}
			<li class="group space-y-2 overflow-hidden">
				<div class="flex gap-1">
					<div class="p-1">
						<MyLittleGptMascot sm />
					</div>
					<!-- This needs to be grid grid-cols-1 because of this bug https://github.com/tailwindlabs/tailwindcss-typography/issues/96#issuecomment-1017139288 -->
					<div class="grid grid-cols-1">
						<!-- eslint-disable svelte/no-at-html-tags -->
						<div class="prose prose-sm md:prose-base">
							{@html DOMPurify.sanitize(/** @type {string} */ (parse(message.content)))}
						</div>
						<!-- eslint-enable svelte/no-at-html-tags -->
						<MessageOptionsButton {message} {onDeleteMessage} />
					</div>
				</div>
			</li>
		{:else if message.role === 'user'}
			<li class="group flex flex-col">
				<div class="chat chat-end">
					<div class="prose prose-sm chat-bubble sm:prose-base whitespace-pre-wrap">
						{message.content}
					</div>
				</div>
				<div class="flex justify-between pe-4">
					<div></div>
					<MessageOptionsButton {message} reverse {onDeleteMessage} />
				</div>
			</li>
		{/if}
	{/each}
</ul>
<form on:submit={onSubmit} class="w-full max-w-screen-md">
	<div class="relative flex items-end gap-2 p-2">
		<textarea
			bind:this={textarea}
			bind:value={input}
			on:input={autoResize}
			on:keypress={onKeypress}
			class="textarea textarea-bordered placeholder-base-content flex-1 resize-none px-4 py-2 pr-11 text-base placeholder-opacity-50"
			disabled={loading}
			placeholder={`...`}
			rows={1}
		/><button
			class="btn btn-square btn-primary btn-sm absolute bottom-4 right-4"
			disabled={!input || loading}
			type="submit"
			>{#if loading}
				<div class="loading loading-spinner" />
			{:else}
				<ArrowLongUp />
			{/if}
		</button>
	</div>
</form>
<div class="text-base-content text-pretty pb-1 text-center text-xs text-opacity-50">
	<p>AI can be wrong. Consider checking info.</p>
</div>
