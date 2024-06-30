import { pb } from '$lib/pocketbase';

/**
 * @param {number} page
 * @param {number} limit
 */
export async function getChats(page, limit = 50) {
	try {
		/** @type {ChatListResult} */
		const resultList = await pb.collection('chats').getList(page, limit);
		return { data: resultList };
	} catch (err) {
		return { error: /** @type {Error} */ (err).message };
	}
}
