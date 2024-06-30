<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { pb } from '$lib/pocketbase';
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { themeChange } from 'theme-change';
	import '../app.css';

	const token = writable(pb.authStore.token);
	const user = writable(pb.authStore.model);

	onMount(() => {
		themeChange(false);
		const theme = localStorage.getItem('theme');
		if (!theme) {
			// Set emerald as default theme
			localStorage.setItem('theme', 'emerald');
			document.documentElement.setAttribute('data-theme', 'emerald');
		}
		const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--b1');
		document
			.querySelector("meta[name='theme-color']")
			?.setAttribute('content', `oklch(${themeColor})`);

		const unsubscribe = pb.authStore.onChange((newToken, model) => {
			console.log(`### [/+layout.svelte:onChange]:`, { model, newToken });
			token.set(newToken);
			user.set(model);
			if (model) {
				localStorage.setItem('hasLoggedIn', 'true');
			}
		}, true);

		if (!$user && $page.url.pathname === '/chat') {
			goto('/');
		} else if ($user && ['/', '/login', '/create-account'].includes($page.url.pathname)) {
			goto('/chat');
		}
		return () => {
			unsubscribe();
		};
	});

	setContext('token', token);
	setContext('user', user);
</script>

<slot />
