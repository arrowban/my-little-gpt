import { getProviderModels } from '$lib/ai';
import { newPocketBase } from '$lib/server/pocketbase';
import { json } from '@sveltejs/kit';

/** @type {Provider[]} */
const PROVIDERS = ['Anthropic', 'Local', 'OpenAI'];

/** @type {import('./$types').RequestHandler} */
export async function GET({ request }) {
	try {
		const authHeader = request.headers.get('x-auth-token');
		if (!authHeader) {
			throw new Error('Unauthorized.');
		}

		const pb = newPocketBase();
		pb.authStore.save(authHeader);
		/** @type {UserAuthRefresh} */
		const user = await pb.collection('users').authRefresh();

		/** @type {ProviderModels} */
		const providerModels = Object.fromEntries(
			await Promise.all(PROVIDERS.map((provider) => getProviderModels(user.record, provider)))
		);

		pb.authStore.clear();

		return json({
			data: { providerModels }
		});
	} catch (err) {
		return json({
			error: /** @type {Error} */ (err).message
		});
	}
}
