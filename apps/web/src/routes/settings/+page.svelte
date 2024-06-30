<script>
	import { goto } from '$app/navigation';
	import ArrowLeft from '$lib/components/icons/ArrowLeft.svelte';
	import { updateUser } from '$lib/db/update-user';
	import { afterUpdate, getContext } from 'svelte';

	/** @type {UserStore} */
	const user = getContext('user');

	let hasEdited = false;
	let localApiKey = $user?.localApiKey || '';
	let localBaseUrl = $user?.localBaseUrl || '';
	let anthropicApiKey = $user?.anthropicApiKey || '';
	let openaiApiKey = $user?.openaiApiKey || '';
	let state = 'done';

	async function onBack() {
		await goto('/chat');
	}

	async function onSave() {
		if (!$user) {
			alert('Error: User not found. Please refresh the page.');
			return;
		}
		state = 'loading';
		const { error } = await updateUser($user.id, {
			localApiKey,
			localBaseUrl,
			anthropicApiKey,
			openaiApiKey
		});
		if (error) {
			alert(`Error: ${error}`);
		}
		state = 'done';
		await goto('/chat');
	}

	afterUpdate(() => {
		hasEdited =
			localApiKey !== ($user?.localApiKey || '') ||
			localBaseUrl !== ($user?.localBaseUrl || '') ||
			openaiApiKey !== ($user?.openaiApiKey || '') ||
			anthropicApiKey !== ($user?.anthropicApiKey || '');
	});
</script>

<main class="flex flex-col items-center">
	<div class="w-full p-8">
		<button on:click={onBack} class="btn btn-square btn-ghost"><ArrowLeft /></button>
	</div>
	<div class="container max-w-screen-md px-4 sm:px-16">
		<div class="card bg-base-300 w-full shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Settings</h2>
				<p>
					Add configuration for different LLM providers, including your own local server (if you
					have one).
				</p>
				<form on:submit|preventDefault class="space-y-4">
					<div class="divider" />
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Local base URL (OpenAI-compatible web server)</span>
						</div>
						<input
							bind:value={localBaseUrl}
							type="text"
							placeholder="http://localhost:8000/v1"
							class="input input-bordered w-full"
						/>
					</label>
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Local API key</span>
						</div>
						<input
							bind:value={localApiKey}
							type="text"
							placeholder="MY_API_KEY"
							class="input input-bordered w-full"
						/>
					</label>
					<div class="divider" />
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Anthropic API key</span>
						</div>
						<input
							bind:value={anthropicApiKey}
							type="text"
							placeholder="sk-xxxx"
							class="input input-bordered w-full"
						/>
					</label>
					<div class="divider" />
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">OpenAI API key</span>
						</div>
						<input
							bind:value={openaiApiKey}
							type="text"
							placeholder="sk-xxxx"
							class="input input-bordered w-full"
						/>
					</label>
					<div class="divider" />
				</form>
				<div class="card-actions justify-end pt-4">
					<button class="btn btn-primary" disabled={!hasEdited} on:click={onSave}
						>{#if state === 'loading'}
							<div class="loading loading-spinner" />
						{:else}
							Save
						{/if}</button
					>
				</div>
			</div>
		</div>
	</div>
</main>
