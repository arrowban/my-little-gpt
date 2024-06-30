<script>
	import clsx from 'clsx';
	import dayjs from 'dayjs';

	export let active = false;
	/** @type {Chat} */
	export let chat;
	/** @type {function(Chat): Promise<void>} */
	export let onClickChat;
	/** @type {function(Chat): Promise<void>} */
	export let onDeleteChat;

	$: modelName = chat.model.name;
</script>

<li class="group">
	<button on:click={() => onClickChat(chat)} class={clsx('flex', { active })}>
		<div class="w-full space-y-2 text-pretty">
			<h3 class="text-wrap font-semibold">
				{chat.title}
			</h3>
			<div class="flex justify-between text-xs">
				<p>
					{modelName}
				</p>
				<p>{dayjs(chat.created).format('h:mma')}</p>
			</div>
		</div>
		<button
			on:click|stopPropagation
			class="dropdown dropdown-end dropdown-bottom absolute bottom-0 right-2 top-0 hidden group-hover:inline-block"
		>
			<div class="">
				<div tabindex="0" role="button" class="btn btn-square btn-sm">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="h-4 w-4"
					>
						<path
							d="M2 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12.5 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
						/>
					</svg>
				</div>
			</div>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<ul
				tabindex="0"
				class="menu dropdown-content rounded-box text-base-content bg-base-100 z-10 w-52 p-2 shadow-2xl"
			>
				<li>
					<div class="whitespace-pre-wrap">{`Provider:\n${chat.model.provider}`}</div>
				</li>
				<li>
					<div class="whitespace-pre-wrap">
						{`Model:\n${modelName}`}
					</div>
				</li>
				<li>
					<div class="whitespace-pre-wrap">
						{`Created:\n${dayjs(chat.created).format('M/DD/YY h:mmA')}`}
					</div>
				</li>
				<li>
					<button
						on:click={() => onDeleteChat(chat)}
						class="hover:bg-error hover:text-error-content">Delete</button
					>
				</li>
			</ul>
		</button>
	</button>
</li>
