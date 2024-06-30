import { pb } from '$lib/pocketbase';

/**
 * @param {Pick<Chat, "user" | "model" | "title">} data
 */
export async function createChat(data) {
	try {
		/** @type {ChatRecordModel} */
		const record = await pb.collection('chats').create(data);
		return { data: record };
	} catch (err) {
		return { error: /** @type {Error} */ (err).message };
	}
}
