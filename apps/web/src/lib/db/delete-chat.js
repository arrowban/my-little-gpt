import { pb } from '$lib/pocketbase';

/**
 * @param {string} chatId
 */
export async function deleteChat(chatId) {
	try {
		await pb.collection('chats').delete(chatId);
		return {};
	} catch (err) {
		return { error: /** @type {Error} */ (err).message };
	}
}
