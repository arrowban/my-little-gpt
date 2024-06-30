import { pb } from '$lib/pocketbase';

/**
 * @param {string} userId
 * @param {Partial<User>} data
 */
export async function updateUser(userId, data) {
	try {
		/** @type {UserRecordModel} */
		const updateResult = await pb.collection('users').update(userId, data);
		return { data: updateResult };
	} catch (err) {
		return { error: /** @type {Error} */ (err).message };
	}
}
