/**
 * List command implementation
 */

import chalk from "chalk";
import { readdir } from "node:fs/promises";
import {
	CONFIG,
	type InstallType,
	isValidType,
	getGithubRawUrl,
} from "./config";
import { fileExists, getInstalledItems } from "./utils";

interface ListOptions {
	installed?: boolean;
	available?: boolean;
}

async function getManifest(): Promise<any> {
	const manifestUrl = getGithubRawUrl("manifest.json");
	const response = await fetch(manifestUrl);
	if (!response.ok) {
		return null;
	}
	return response.json();
}

async function listAgents(options: ListOptions): Promise<void> {
	const installed = await getInstalledItems(CONFIG.paths.agents);
	const manifest = await getManifest();
	const available = manifest?.agents || [];

	console.log(chalk.bold.cyan("\n📦 Agents"));
	console.log(chalk.gray("━".repeat(40)));

	if (!options.available) {
		console.log(chalk.green(`\nInstalled (${installed.length}):`));
		if (installed.length === 0) {
			console.log(chalk.gray("  None installed"));
		} else {
			installed.forEach((item) => {
				console.log(chalk.gray(`  ✓ ${item.replace(".md", "")}`));
			});
		}
	}

	if (!options.installed && available.length > 0) {
		console.log(chalk.cyan(`\nAvailable (${available.length}):`));
		available.forEach((agent: any) => {
			const isInstalled = installed.includes(agent.filename);
			const status = isInstalled ? chalk.green("✓") : chalk.gray("○");
			console.log(
				`  ${status} ${agent.name} - ${chalk.gray(agent.description)}`,
			);
		});
	}
}

async function listDocs(options: ListOptions): Promise<void> {
	const installed = await getInstalledItems(CONFIG.paths.docs);
	const manifest = await getManifest();
	const available = manifest?.docs || [];

	console.log(chalk.bold.cyan("\n📚 Documentation"));
	console.log(chalk.gray("━".repeat(40)));

	if (!options.available) {
		console.log(chalk.green(`\nInstalled (${installed.length}):`));
		if (installed.length === 0) {
			console.log(chalk.gray("  None installed"));
		} else {
			installed.forEach((item) => {
				console.log(chalk.gray(`  ✓ ${item.replace(".md", "")}`));
			});
		}
	}

	if (!options.installed && available.length > 0) {
		console.log(chalk.cyan(`\nAvailable (${available.length}):`));
		available.forEach((doc: any) => {
			const isInstalled = installed.includes(doc.filename);
			const status = isInstalled ? chalk.green("✓") : chalk.gray("○");
			console.log(`  ${status} ${doc.name} - ${chalk.gray(doc.category)}`);
		});
	}
}

async function listReference(options: ListOptions): Promise<void> {
	const installed = await getInstalledItems(CONFIG.paths.reference);
	const manifest = await getManifest();
	const available = manifest?.reference || [];

	console.log(chalk.bold.cyan("\n📂 Reference Code"));
	console.log(chalk.gray("━".repeat(40)));

	if (!options.available) {
		console.log(chalk.green(`\nInstalled (${installed.length}):`));
		if (installed.length === 0) {
			console.log(chalk.gray("  None installed"));
		} else {
			installed.forEach((item) => {
				console.log(chalk.gray(`  ✓ ${item}`));
			});
		}
	}

	if (!options.installed && available.length > 0) {
		console.log(chalk.cyan(`\nAvailable (${available.length}):`));
		available.forEach((ref: any) => {
			const isInstalled = installed.includes(ref.name);
			const status = isInstalled ? chalk.green("✓") : chalk.gray("○");
			console.log(`  ${status} ${ref.name} - ${chalk.gray(ref.description)}`);
		});
	}
}

export async function listCommand(
	type?: string,
	options: ListOptions = {},
): Promise<void> {
	if (!type || type === "all") {
		await listAgents(options);
		await listDocs(options);
		await listReference(options);
		console.log();
		return;
	}

	if (!isValidType(type) || type === "all") {
		console.log(chalk.red(`\n❌ Invalid type: ${type}`));
		console.log(chalk.gray("Valid types: agents, docs, reference"));
		return;
	}

	switch (type) {
		case "agents":
			await listAgents(options);
			break;
		case "docs":
			await listDocs(options);
			break;
		case "reference":
			await listReference(options);
			break;
	}
	console.log();
}
