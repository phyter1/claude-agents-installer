/**
 * Configuration for Claude Agents Installer
 */

import { homedir } from "node:os";
import { join } from "node:path";

export const CONFIG = {
	paths: {
		home: homedir(),
		claude: join(homedir(), ".claude"),
		agents: join(homedir(), ".claude", "agents"),
		docs: join(homedir(), ".claude", "docs"),
		reference: join(homedir(), ".claude", "reference_code"),
		cache: join(homedir(), ".claude", ".installer-cache"),
	},
	github: {
		owner: "phyter1",
		repo: "claude-code-assets",
		branch: "main",
		apiBase: "https://api.github.com",
		rawBase: "https://raw.githubusercontent.com",
	},
	validTypes: ["agents", "docs", "reference", "all"] as const,
};

export type InstallType = (typeof CONFIG.validTypes)[number];

export function isValidType(type: string): type is InstallType {
	return CONFIG.validTypes.includes(type as InstallType);
}

export function getGithubRawUrl(path: string): string {
	const { owner, repo, branch, rawBase } = CONFIG.github;
	return `${rawBase}/${owner}/${repo}/${branch}/${path}`;
}

export function getGithubApiUrl(path: string): string {
	const { owner, repo, apiBase } = CONFIG.github;
	return `${apiBase}/repos/${owner}/${repo}/${path}`;
}
