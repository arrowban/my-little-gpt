import { pb } from '$lib/pocketbase';

/**
 * @param {Pick<Message, "chat" | "role" | "content">} data
 */
export async function createMessage(data) {
	try {
		/** @type {MessageRecordModel} */
		const record = await pb.collection('messages').create(data);
		return { data: record };
	} catch (err) {
		return { error: /** @type {Error} */ (err).message };
	}
}
