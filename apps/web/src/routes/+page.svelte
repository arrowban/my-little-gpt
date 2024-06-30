<script>
	import { goto } from '$app/navigation';
	import MyLittleGptMascot from '$lib/components/MyLittleGptMascot.svelte';
	import Welcome from '$lib/components/Welcome.svelte';
	import { getContext } from 'svelte';

	const GITHUB_URL = 'https://github.com/arrowban/my-little-gpt';

	/** @type {UserStore} */
	const user = getContext('user');
</script>

<div class="bg-base-200 flex min-h-screen justify-center p-8">
	<div class="flex w-full max-w-screen-sm flex-col items-center justify-center gap-8 sm:p-24">
		<MyLittleGptMascot lg floating />
		<div class="h-12 sm:h-8">
			<Welcome />
		</div>

		<div class="flex w-full flex-col gap-6">
			<div class="card bg-base-100 w-full shadow-xl">
				<div class="card-body p-5">
					<h2 class="card-title text-base">Self-host your own private AI assistant</h2>
					<ul class="list-disc space-y-2 text-pretty py-2 ps-4 text-sm">
						<li>
							Chat with open-source models running on your computer, or with hosted model APIs
						</li>
						<li>Mobile-optimized so you can chat with your assistant anywhere</li>
					</ul>
					<div class="card-actions justify-end">
						<a class="btn btn-primary btn-sm" href={GITHUB_URL} target="_blank">Get started</a>
					</div>
				</div>
			</div>
			<button
				on:click={async () => {
					let route = '/create-account';
					const hasLoggedIn = localStorage.getItem('hasLoggedIn') === 'true';
					if ($user) {
						route = '/chat';
					} else if (hasLoggedIn) {
						route = '/login';
					}
					await goto(route);
				}}
				class="btn btn-outline">Try the hosted version for free</button
			>
		</div>
	</div>
</div>
