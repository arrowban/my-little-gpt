<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ChatListItem from '$lib/components/ChatListItem.svelte';
	import ChatUi from '$lib/components/ChatUi.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import ThemePickerListItem from '$lib/components/ThemePickerListItem.svelte';
	import ArrowRightStartOnRectangle from '$lib/components/icons/ArrowRightStartOnRectangle.svelte';
	import Cog6Tooth from '$lib/components/icons/Cog6Tooth.svelte';
	import PencilSquare from '$lib/components/icons/PencilSquare.svelte';
	import { createChat } from '$lib/db/create-chat';
	import { createMessage } from '$lib/db/create-message';
	import { deleteChat } from '$lib/db/delete-chat';
	import { deleteMessage } from '$lib/db/delete-message';
	import { getChats } from '$lib/db/get-chats';
	import { getMessages } from '$lib/db/get-messages';
	import { pb } from '$lib/pocketbase';
	import { useChat } from '@ai-sdk/svelte';
	import dayjs from 'dayjs';
	import calendar from 'dayjs/plugin/calendar';
	import isEqual from 'lodash.isequal';
	import { getContext, onMount } from 'svelte';
	dayjs.extend(calendar);

	const PATH = `/chat`;

	/** @type {TokenStore}*/
	const token = getContext('token');
	/** @type {UserStore} */
	const user = getContext('user');

	/** @type {HTMLUListElement} */
	let chatDiv;
	let chatId = $page.url.searchParams.get('chatId');
	/** @type {Chat[] | null} */
	let chats = null;
	let chatState = 'loading';
	/** @type {Chat | null} */
	let currentChat = null;
	/** @type {Model | null} */
	let currentModel = null;
	/** @type {string | null} */
	let error = null;
	/** @type {ProviderModels | null} */
	let providerModels = null;
	let shouldAutoScroll = true;
	let state = 'loading';
	/** @type {HTMLTextAreaElement} */
	let textarea;

	const { input, isLoading, messages, handleSubmit, setMessages } = useChat({
		credentials: 'include',
		onFinish: async function (message) {
			if (!chatId) {
				state = 'error';
				error = `Error: Expected chatId to be defined.`;
				return;
			}
			const createMessageResult = await createMessage({
				chat: chatId,
				role: /** @type {Role} */ (message.role),
				content: message.content
			});
			if (!createMessageResult.data || createMessageResult.error) {
				state = 'error';
				error = `Error: ${createMessageResult.error || 'No data'}`;
				return;
			}
			autoResize();
			state = 'done';
		}
	});

	function autoResize() {
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	}

	/** @param {ScrollBehavior} behavior */
	function autoScroll(behavior = 'auto', overrideShouldAutoScroll = false) {
		if (!chatDiv || (!shouldAutoScroll && !overrideShouldAutoScroll)) {
			return;
		}
		chatDiv.scrollTo({ top: chatDiv.scrollHeight, behavior });
	}

	async function initializeChat() {
		currentChat = chatId ? chats?.find((chat) => chat.id === chatId) ?? null : null;
		if (chatId && currentChat) {
			currentModel = currentChat.model;
			const getMessagesResult = await getMessages(chatId);
			if (!getMessagesResult.data || getMessagesResult.error) {
				state = 'error';
				error = `Error: ${getMessagesResult.error || 'No data'}`;
				return;
			}
			setMessages(
				getMessagesResult.data
					.sort((a, b) => a.created.localeCompare(b.created))
					.map((message) => ({
						id: message.id,
						role: message.role,
						content: message.content
					}))
			);
		} else if (chatId) {
			alert('Chat not found.');
			openNewChat();
		}
	}

	/** @param {KeyboardEvent} e */
	function onKeypress(e) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onSubmit(e);
			textarea.style.height = 'auto';
		}
	}

	/** @param {Model} model */
	function onModelChange(model) {
		localStorage.setItem('defaultModel', JSON.stringify(model));
		if (currentChat) {
			openNewChat();
			return;
		}
		currentModel = model;
	}

	function openNewChat() {
		window.location.href = PATH;
	}

	/** @param {Chat} chat */
	async function onClickChat(chat) {
		chatId = chat.id;
		await goto(`${PATH}?chatId=${chat.id}`);
		await initializeChat();
	}

	/** @param {Chat} chat */
	async function onDeleteChat(chat) {
		if (
			!confirm(
				`Are you sure you want to delete this chat?\n\nChat: ${chat.title}\nModel: ${chat.model.name}\nCreated: ${dayjs(
					chat.created
				).format('YYYY-MM-DD hh:mm A')}`
			)
		) {
			return;
		}
		await deleteChat(chat.id);
		if (chatId === chat.id) {
			openNewChat();
		} else {
			await refreshChats();
		}
	}

	/** @param {Pick<Message, "content" | "created" | "id" | "role">} message */
	async function onDeleteMessage(message) {
		if (
			!confirm(
				`Are you sure you want to delete this message?\n\nMessage: ${message.content.slice(0, 100) + (message.content.length > 100 ? '...' : '')}\nCreated: ${dayjs(
					message.created
				).format('YYYY-MM-DD hh:mm A')}`
			)
		) {
			return;
		}
		await deleteMessage(message.id);
		setMessages($messages.filter((m) => m.id !== message.id));
	}

	async function generateChatTitle() {
		const res = await fetch('/api/generate-chat-title', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-auth-token': $token
			},
			credentials: 'include',
			body: JSON.stringify({ messages: [{ role: 'user', content: $input }], model: currentModel })
		});
		if (!res.ok) {
			state = 'error';
			return null;
		}
		/** @type {{data?: {title: string}; error?: string}} */
		const resData = await res.json();
		if (!resData.data || resData.error) {
			state = 'error';
			error = `Error: Failed to generate chat title.`;
			return null;
		}
		return resData.data.title;
	}

	async function getProviderModels() {
		const res = await fetch('/api/provider-models', {
			headers: {
				'x-auth-token': $token
			},
			credentials: 'include'
		});
		if (!res.ok) {
			state = 'error';
			return null;
		}
		/** @type {{data?: {providerModels: ProviderModels}; error?: string}} */
		const resData = await res.json();
		if (!resData.data || resData.error) {
			if (resData.error === 'The request requires valid record authorization token to be set.') {
				await signOut();
				return null;
			}
			state = 'error';
			error = `Error: ${resData.error || 'No data'}`;
			return null;
		}
		return resData.data.providerModels;
	}

	async function gotoSettings() {
		await goto('/settings');
	}

	/** @param {Event} e */
	async function onSubmit(e) {
		if (!$user) {
			state = 'error';
			error = 'Error: User not found.';
			return;
		}
		if (!currentModel) {
			alert('Please select a model first.');
			return;
		}

		// Check if user has required provider data
		switch (currentModel.provider) {
			case 'Local': {
				if (!$user.localBaseUrl) {
					alert('Please set your local base URL in settings.');
					return;
				}
				break;
			}
			case 'Anthropic': {
				if (!$user.anthropicApiKey) {
					alert('Please set your Anthropic API key in settings.');
					return;
				}
				break;
			}
			case 'OpenAI': {
				if (!$user.openaiApiKey) {
					alert('Please set your OpenAI API key in settings.');
					return;
				}
				break;
			}
		}

		state = 'loading';
		// Create chat if it doesn't exist
		if (!currentChat) {
			const title = await generateChatTitle();
			if (!title) {
				return;
			}
			const createChatResult = await createChat({
				model: currentModel,
				title,
				user: $user.id
			});
			if (!createChatResult.data || createChatResult.error) {
				state = 'error';
				error = `Error: ${createChatResult.error || 'No data'}`;
				return;
			}
			currentChat = createChatResult.data;
			chatId = createChatResult.data.id;
			await goto(`${PATH}?chatId=${chatId}`);
			chats = [createChatResult.data, ...(chats ?? [])];
		}
		if (!chatId) {
			state = 'error';
			error = 'Error: Expected chatId to be defined.';
			return;
		}
		// Add user message
		const createMessageResult = await createMessage({
			chat: chatId,
			role: 'user',
			content: $input
		});
		if (!createMessageResult.data || createMessageResult.error) {
			state = 'error';
			error = `Error: ${createMessageResult.error || 'No data'}`;
			return;
		}
		handleSubmit(e, {
			options: {
				body: { model: currentModel },
				headers: {
					'x-auth-token': $token
				}
			}
		});
	}

	async function refreshChats() {
		chatState = 'loading';
		const getChatsResult = await getChats();
		if (!getChatsResult.data || getChatsResult.error) {
			state = 'error';
			error = `Error: ${getChatsResult.error || 'No data'}`;
			return;
		}
		chats = getChatsResult.data.sort((a, b) => b.created.localeCompare(a.created));
		chatState = 'done';
	}

	async function signOut() {
		pb.authStore.clear();
		await goto('/login');
	}

	onMount(async () => {
		chatDiv.addEventListener('scroll', () => {
			// Disable autoscroll when the user scrolls up
			shouldAutoScroll = chatDiv.scrollTop + chatDiv.clientHeight >= chatDiv.scrollHeight;
		});
		await refreshChats();
		await initializeChat();
		providerModels = await getProviderModels();
		if (!currentModel) {
			const defaultModelStr = localStorage.getItem('defaultModel');
			/** @type {Model | null} */
			const defaultModel = defaultModelStr ? JSON.parse(defaultModelStr) : null;
			currentModel =
				(defaultModel
					? providerModels?.[defaultModel.provider]?.models?.find((model) =>
							isEqual(defaultModel, model)
						)
					: Object.values(providerModels ?? {}).find(({ models }) => models.length > 0)
							?.models[0]) ?? null;
		}
		if (state !== 'error') {
			state = 'done';
		}
		autoScroll('smooth', true);
		setTimeout(() => {
			textarea.focus();
		}, 200);
	});

	$: chatsByDay =
		chats?.reduce((acc, chat) => {
			const day = dayjs(chat.created).format('YYYY-MM-DD');
			if (!acc[day]) {
				acc[day] = [];
			}
			acc[day].push(chat);
			return acc;
		}, /** @type {Record<string, Chat[]>} */ ({})) ?? {};

	$: loading = $isLoading || state === 'loading';
	$: {
		$messages[$messages.length - 1]?.content.length && autoScroll();
	}
</script>

<div class="drawer lg:drawer-open">
	<input id="drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex max-h-screen min-h-screen flex-col pb-4 sm:pb-0">
		<Navbar {currentModel} {providerModels} {loading} {onModelChange} {openNewChat} />

		{#if state === 'error'}
			<div role="alert" class="alert alert-error">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="size-6 shrink-0 stroke-current"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<span>{error}</span>
			</div>
		{/if}

		<main class="container relative mx-auto flex h-full flex-col items-center overflow-hidden">
			<ChatUi
				bind:input={$input}
				bind:chatDiv
				bind:textarea
				{chatId}
				{loading}
				messages={$messages.map((message) => ({
					id: message.id,
					created: dayjs(message.createdAt).toISOString(),
					updated: dayjs(message.createdAt).toISOString(),
					chat: chatId || '',
					content: message.content,
					role: /** @type {Message["role"]} */ (message.role)
				}))}
				{autoResize}
				{onDeleteMessage}
				{onKeypress}
				{onSubmit}
			/>
		</main>
	</div>
	<div class="drawer-side z-10">
		<label for="drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu bg-base-100 lg:bg-base-200 min-h-full w-80 overflow-hidden p-4">
			<li>
				<button
					on:click={openNewChat}
					class="btn btn-secondary btn-sm flex items-center justify-between font-semibold"
					><div class="flex items-center gap-1 font-semibold">
						<div>New chat</div>
					</div>
					<PencilSquare />
				</button>
			</li>
			<div class="divider my-2"></div>
			<li>
				<button on:click={gotoSettings} class="flex items-center justify-between"
					><div>Settings</div>
					<Cog6Tooth />
				</button>
			</li>
			<li>
				<button on:click={signOut} class="flex items-center justify-between"
					><div>Sign out</div>
					<ArrowRightStartOnRectangle />
				</button>
			</li>
			<div class="divider my-2"></div>
			<ThemePickerListItem />
			<div class="divider my-2"></div>
			{#each Object.keys(chatsByDay) as day}
				<li>
					<h2 class="menu-title text-base-content">
						{dayjs(day).calendar(dayjs(), {
							sameDay: '[Today]', // The same day ( Today at 2:30 AM )
							nextDay: '[Tomorrow]', // The next day ( Tomorrow at 2:30 AM )
							nextWeek: 'dddd', // The next week ( Sunday at 2:30 AM )
							lastDay: '[Yesterday]', // The day before ( Yesterday at 2:30 AM )
							lastWeek: '[Last] dddd', // Last week ( Last Monday at 2:30 AM )
							sameElse: 'ddd, MMM D' // Everything else ( 7/10/2011 )
						})}
					</h2>
					<ul>
						{#each chatsByDay[day] as chat}
							<ChatListItem active={chat.id === chatId} {chat} {onClickChat} {onDeleteChat} />
						{/each}
					</ul>
				</li>
			{/each}
			{#if chatState === 'loading'}
				<div class="flex justify-center py-2">
					<div class="loading loading-spinner" />
				</div>
			{/if}
		</ul>
	</div>
</div>
