/**
 * @typedef {Object} ApiChatParams
 * @property {string} maxTokens
 * @property {Pick<Message, "role" | "content">[]} messages
 * @property {Model} model
 * @property {string} token
 *
 * @typedef {Object} ApiCreateAccountParams
 * @property {string} email
 * @property {string} password
 * @property {string} passwordConfirm
 *
 * @typedef {Record<Provider, {models: Model[]; error?: string}>} ProviderModels
 *
 */
