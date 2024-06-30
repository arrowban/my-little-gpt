import { getAiModel } from '$lib/ai';
import { newPocketBase } from '$lib/server/pocketbase';
import { streamText } from 'ai';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		/** @type {ApiChatParams} */
		const body = await request.json();
		const { model, maxTokens, messages } = body;
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

		const result = await streamText({
			maxTokens: maxTokens ? parseInt(maxTokens) : undefined,
			messages,
			model: aiModel
		});
		return result.toAIStreamResponse();
	} catch (err) {
		return new Response(/** @type {Error} */ (err).message, { status: 500 });
	}
}
