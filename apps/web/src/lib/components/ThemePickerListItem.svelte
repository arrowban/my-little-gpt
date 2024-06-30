<script>
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	const THEMES = [
		'Emerald',
		'Cupcake',
		'Bumblebee',
		'Corporate',
		'Synthwave',
		'Retro',
		'Cyberpunk',
		'Valentine',
		'Halloween',
		'Garden',
		'Forest',
		'Aqua',
		'Lofi',
		'Pastel',
		'Fantasy',
		'Wireframe',
		'Black',
		'Luxury',
		'Dracula',
		'Cmyk',
		'Autumn',
		'Business',
		'Acid',
		'Lemonade',
		'Night',
		'Coffee',
		'Winter',
		'Dim',
		'Nord',
		'Sunset'
	];

	let localTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;

	/** @param {string} theme */
	function onClickTheme(theme) {
		localTheme = theme.toLowerCase();

		const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--b1');
		document
			.querySelector("meta[name='theme-color']")
			?.setAttribute('content', `oklch(${themeColor})`);
	}

	onMount(() => {
		themeChange(false);
	});
</script>

<li class="dropdown">
	<div tabindex="0" role="button" class="flex justify-between">
		<div>
			Theme:
			<span class="capitalize">{localTheme ?? 'Default'}</span>
		</div>
		<svg
			width="12px"
			height="12px"
			class="inline-block h-2 w-2 fill-current opacity-60"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 2048 2048"
			><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg
		>
	</div>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<ul
		tabindex="0"
		class="dropdown-content rounded-box bg-base-100 z-10 max-h-96 w-52 overflow-scroll p-2 shadow-2xl"
	>
		{#each THEMES as theme}
			<li>
				<input
					on:click={() => onClickTheme(theme)}
					data-set-theme={theme.toLowerCase()}
					checked={localTheme === theme.toLowerCase()}
					type="radio"
					name="theme-dropdown"
					class="theme-controller btn btn-ghost btn-sm btn-block justify-start"
					aria-label={theme}
					value={theme.toLowerCase()}
				/>
			</li>
		{/each}
	</ul>
</li>
