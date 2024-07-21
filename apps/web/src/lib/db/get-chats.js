import { pb } from '$lib/pocketbase';

export async function getChats() {
	try {
		/** @type {ChatListResult} */
		const resultList = await pb.collection('chats').getFullList();
		return { data: resultList };
	} catch (err) {
		return { error: /** @type {Error} */ (err).message };
	}
}
