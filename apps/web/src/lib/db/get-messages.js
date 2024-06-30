import { pb } from '$lib/pocketbase';

/**
 * @param {string} chatId
 */
export async function getMessages(chatId) {
	try {
		/** @type {MessageRecordModel[]} */
		const resultList = await pb.collection('messages').getFullList({
			filter: `chat="${chatId}"`
		});
		return { data: resultList };
	} catch (err) {
		return { error: /** @type {Error} */ (err).message };
	}
}
