import { pb } from '$lib/pocketbase';

/**
 * @param {string} messageId
 */
export async function deleteMessage(messageId) {
	try {
		await pb.collection('messages').delete(messageId);
		return {};
	} catch (err) {
		return { error: /** @type {Error} */ (err).message };
	}
}
