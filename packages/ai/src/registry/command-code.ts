import type { OAuthController, OAuthLoginCallbacks } from "./oauth/types";
import type { ProviderDefinition } from "./types";

const COMMAND_CODE_KEYS_URL = "https://commandcode.ai/studio/";

export async function loginCommandCode(options: OAuthController): Promise<string> {
	if (options.signal?.aborted) {
		throw new Error("Login cancelled");
	}
	if (!options.onPrompt) {
		throw new Error("Interactive prompt is required for Command Code login");
	}
	options.onAuth?.({
		url: COMMAND_CODE_KEYS_URL,
		instructions: "Create a Command Code API key (Provider plan), then paste it here.",
	});
	const apiKey = await options.onPrompt({
		message: "Paste your Command Code API key",
		placeholder: "cmd-...",
	});
	if (options.signal?.aborted) {
		throw new Error("Login cancelled");
	}
	const trimmed = apiKey.trim();
	if (!trimmed) {
		throw new Error("Command Code API key is required");
	}
	return trimmed;
}

export const commandCodeProvider = {
	id: "command-code",
	name: "Command Code",
	login: (cb: OAuthLoginCallbacks) => loginCommandCode(cb),
} as const satisfies ProviderDefinition;
