/**
 * Status command implementation
 */

import chalk from "chalk";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { CONFIG } from "./config";
import { getInstalledItems, formatBytes, fileExists } from "./utils";

async function getDirectorySize(dir: string): Promise<number> {
	let totalSize = 0;

	try {
		const items = await getInstalledItems(dir);
		for (const item of items) {
			const path = join(dir, item);
			const stats = await stat(path);
			if (stats.isFile()) {
				totalSize += stats.size;
			} else if (stats.isDirectory()) {
				// Recursively get size of subdirectory
				totalSize += await getDirectorySize(path);
			}
		}
	} catch {
		// Directory doesn't exist or can't be read
	}

	return totalSize;
}

export async function statusCommand(): Promise<void> {
	console.log(chalk.bold.cyan("\n📊 Installation Status"));
	console.log(chalk.gray("━".repeat(40)));

	// Check agents
	const agents = await getInstalledItems(CONFIG.paths.agents);
	const agentsSize = await getDirectorySize(CONFIG.paths.agents);
	console.log(chalk.cyan("\n📦 Agents:"));
	console.log(chalk.gray(`  Installed: ${agents.length}`));
	console.log(chalk.gray(`  Size: ${formatBytes(agentsSize)}`));
	if (agents.length > 0) {
		console.log(chalk.gray("  Recent:"));
		agents.slice(0, 3).forEach((agent) => {
			console.log(chalk.gray(`    • ${agent.replace(".md", "")}`));
		});
	}

	// Check docs
	const docs = await getInstalledItems(CONFIG.paths.docs);
	const docsSize = await getDirectorySize(CONFIG.paths.docs);
	console.log(chalk.cyan("\n📚 Documentation:"));
	console.log(chalk.gray(`  Installed: ${docs.length}`));
	console.log(chalk.gray(`  Size: ${formatBytes(docsSize)}`));
	if (docs.length > 0) {
		console.log(chalk.gray("  Recent:"));
		docs.slice(0, 3).forEach((doc) => {
			console.log(chalk.gray(`    • ${doc.replace(".md", "")}`));
		});
	}

	// Check reference code
	const reference = await getInstalledItems(CONFIG.paths.reference);
	const referenceSize = await getDirectorySize(CONFIG.paths.reference);
	console.log(chalk.cyan("\n📂 Reference Code:"));
	console.log(chalk.gray(`  Installed: ${reference.length} projects`));
	console.log(chalk.gray(`  Size: ${formatBytes(referenceSize)}`));
	if (reference.length > 0) {
		console.log(chalk.gray("  Projects:"));
		reference.slice(0, 3).forEach((ref) => {
			console.log(chalk.gray(`    • ${ref}`));
		});
	}

	// Total statistics
	const totalItems = agents.length + docs.length + reference.length;
	const totalSize = agentsSize + docsSize + referenceSize;

	console.log(chalk.bold.cyan("\n📈 Total:"));
	console.log(chalk.gray(`  Items: ${totalItems}`));
	console.log(chalk.gray(`  Size: ${formatBytes(totalSize)}`));

	// Check if directories exist
	console.log(chalk.bold.cyan("\n📍 Directories:"));
	console.log(
		chalk.gray(
			`  Agents:    ${(await fileExists(CONFIG.paths.agents)) ? chalk.green("✓") : chalk.red("✗")} ${CONFIG.paths.agents}`,
		),
	);
	console.log(
		chalk.gray(
			`  Docs:      ${(await fileExists(CONFIG.paths.docs)) ? chalk.green("✓") : chalk.red("✗")} ${CONFIG.paths.docs}`,
		),
	);
	console.log(
		chalk.gray(
			`  Reference: ${(await fileExists(CONFIG.paths.reference)) ? chalk.green("✓") : chalk.red("✗")} ${CONFIG.paths.reference}`,
		),
	);

	console.log();
}
