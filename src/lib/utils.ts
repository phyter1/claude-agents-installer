/**
 * Utility functions for Claude Agents Installer
 */

import { mkdir, exists, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import chalk from "chalk";

export async function ensureDir(dir: string): Promise<void> {
	await mkdir(dir, { recursive: true });
}

export async function fileExists(path: string): Promise<boolean> {
	try {
		return await exists(path);
	} catch {
		return false;
	}
}

export async function downloadFile(url: string, dest: string): Promise<void> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to download ${url}: ${response.statusText}`);
	}

	await ensureDir(dirname(dest));
	const content = await response.text();
	await Bun.write(dest, content);
}

export async function getInstalledItems(dir: string): Promise<string[]> {
	try {
		const items = await readdir(dir);
		return items.filter((item) => !item.startsWith("."));
	} catch {
		return [];
	}
}

export function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function printProgress(
	current: number,
	total: number,
	message: string,
): void {
	const percentage = Math.round((current / total) * 100);
	const bar =
		"█".repeat(Math.floor(percentage / 2)) +
		"░".repeat(50 - Math.floor(percentage / 2));
	process.stdout.write(`\r${chalk.cyan(bar)} ${percentage}% - ${message}`);
	if (current === total) {
		process.stdout.write("\n");
	}
}

export async function fetchGithubContent(apiUrl: string): Promise<any> {
	const response = await fetch(apiUrl, {
		headers: {
			Accept: "application/vnd.github.v3+json",
			"User-Agent": "claude-agents-installer",
		},
	});

	if (!response.ok) {
		throw new Error(`GitHub API error: ${response.statusText}`);
	}

	return response.json();
}

export function parseFilter(filter?: string): string[] {
	if (!filter) return [];
	return filter
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
}
