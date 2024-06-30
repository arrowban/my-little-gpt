import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import OpenAI from 'openai';

/**
 * @param {User} user
 * @param {Model} model
 */
export function getAiModel(user, model) {
	switch (model.provider) {
		case 'Anthropic': {
			if (!user.anthropicApiKey) {
				throw new Error('Anthropic API key not set.');
			}
			const anthropic = createAnthropic({
				apiKey: user.anthropicApiKey
			});
			return anthropic(model.name);
		}
		case 'Local':
		case 'OpenAI': {
			/** @type {import('@ai-sdk/openai').OpenAIProviderSettings} */
			const options = {};
			switch (model.provider) {
				case 'Local': {
					if (!user.localBaseUrl) {
						throw new Error('Local base URL not set.');
					}
					options.apiKey = user.localApiKey;
					options.baseURL = user.localBaseUrl;
					break;
				}
				case 'OpenAI': {
					if (!user.openaiApiKey) {
						throw new Error('OpenAI API key not set.');
					}
					options.apiKey = user.openaiApiKey;
					break;
				}
			}
			const openai = createOpenAI(options);
			return openai(model.name);
		}
	}
}

/**
 * @param {User} user
 * @param {Provider} provider
 */
export function getOpenaiClient(user, provider) {
	/** @type {import('openai').ClientOptions} */
	const clientOptions = {};
	switch (provider) {
		case 'Local': {
			if (!user.localBaseUrl) {
				throw new Error('Local base URL not set.');
			}
			clientOptions.apiKey = user.localApiKey || 'MY_API_KEY';
			clientOptions.baseURL = user.localBaseUrl;
			break;
		}
		case 'OpenAI': {
			if (!user.openaiApiKey) {
				throw new Error('OpenAI API key not set.');
			}
			clientOptions.apiKey = user.openaiApiKey;
			break;
		}
	}
	return new OpenAI(clientOptions);
}

/**
 * @param {User} user
 * @param {Provider} provider
 */
export async function getProviderModels(user, provider) {
	try {
		switch (provider) {
			case 'Anthropic': {
				return [
					provider,
					{
						models: [
							{ name: 'claude-3-5-sonnet-20240620', provider },
							{ name: 'claude-3-opus-20240229', provider },
							{ name: 'claude-3-sonnet-20240229', provider },
							{ name: 'claude-3-haiku-20240307', provider }
						]
					}
				];
			}
			case 'Local': {
				if (!user.localBaseUrl) {
					return [provider, { models: [] }];
				}
				const openai = getOpenaiClient(user, provider);
				const models = await openai.models.list();
				return [provider, { models: models.data.map((model) => ({ name: model.id, provider })) }];
			}
			case 'OpenAI': {
				return [
					provider,
					{
						models: [
							{ name: 'gpt-4o', provider },
							{ name: 'gpt-4-turbo', provider },
							{ name: 'gpt-4', provider },
							{ name: 'gpt-3.5-turbo', provider }
						]
					}
				];
			}
		}
	} catch (err) {
		return [
			provider,
			{
				error: typeof err === 'string' ? err : /** @type {Error} */ (err).message,
				models: []
			}
		];
	}
}
