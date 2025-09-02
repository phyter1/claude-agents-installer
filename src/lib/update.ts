/**
 * Update command implementation
 */

import chalk from "chalk";
import { CONFIG, type InstallType, isValidType } from "./config";
import { installCommand } from "./install";

interface UpdateOptions {
	force?: boolean;
}

export async function updateCommand(
	type?: string,
	options: UpdateOptions = {},
): Promise<void> {
	if (!type) {
		type = "all";
	}

	if (!isValidType(type)) {
		console.log(chalk.red(`\n❌ Invalid type: ${type}`));
		console.log(chalk.gray("Valid types: agents, docs, reference, all"));
		return;
	}

	console.log(chalk.bold.cyan("\n🔄 Updating from GitHub..."));
	console.log(chalk.gray("━".repeat(40)));

	// Use install command with force flag to update
	await installCommand(type, { force: true });
}
