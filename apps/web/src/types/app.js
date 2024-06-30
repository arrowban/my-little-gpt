/**
 * @typedef {object} User
 * @property {string} id
 * @property {string} created
 * @property {string} updated
 * @property {string} username
 * @property {string} email
 * @property {boolean} emailVisibility
 * @property {boolean} verified
 * @property {string} name
 * @property {string} avatar
 * @property {string} anthropicApiKey
 * @property {string} localApiKey
 * @property {string} localBaseUrl
 * @property {string} openaiApiKey
 *
 * @typedef {"Anthropic" | "Local" | "OpenAI"} Provider
 *
 * @typedef {object} Model
 * @property {string} name
 * @property {Provider} provider
 *
 * @typedef {object} Chat
 * @property {string} id
 * @property {string} created
 * @property {string} updated
 * @property {Model} model
 * @property {string} title
 * @property {string} user
 *
 * @typedef {'system' | 'assistant' | 'user'} Role
 *
 * @typedef {object} Message
 * @property {string} id
 * @property {string} created
 * @property {string} updated
 * @property {string} chat
 * @property {string} content
 * @property {Role} role
 *
 * @typedef {import("svelte/store").Writable<string>} TokenStore
 * @typedef {import("svelte/store").Writable<User | null>} UserStore
 */
