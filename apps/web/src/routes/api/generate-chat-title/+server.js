import { getAiModel } from '$lib/ai';
import { newPocketBase } from '$lib/server/pocketbase';
import { json } from '@sveltejs/kit';
import { generateText } from 'ai';

/** @param {string} context */
function PROMPT(context) {
	return `Write a short title (at most 8 words) for the following question: ${context}`;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		/** @type {ApiChatParams} */
		const body = await request.json();
		const { model, maxTokens = '128', messages } = body;
		const authHeader = request.headers.get('x-auth-token');
		if (!authHeader) {
			throw new Error('Unauthorized.');
		}

		const pb = newPocketBase();
		pb.authStore.save(authHeader);
		/** @type {UserAuthRefresh} */
		const user = await pb.collection('users').authRefresh();

		const aiModel = getAiModel(user.record, model);
		pb.authStore.clear();

		const context = `${messages.map((message) => `${message.content}`).join('. ')}`;
		const { text } = await generateText({
			maxTokens: parseInt(maxTokens),
			model: aiModel,
			prompt: PROMPT(context)
		});
		let title = text.split(' ').slice(0, 11).join(' ').trim();
		if (title.startsWith('"')) {
			title = title.slice(1);
			title = title.slice(0, title.indexOf('"'));
		}
		if (title.endsWith('"')) {
			title = title.slice(0, -1);
		}
		return json({
			data: { title }
		});
	} catch (err) {
		return json({
			error: /** @type {Error} */ (err).message
		});
	}
}
