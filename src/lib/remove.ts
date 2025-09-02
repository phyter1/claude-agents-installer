/**
 * Remove command implementation
 */

import chalk from "chalk";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { CONFIG, type InstallType, isValidType } from "./config";
import { getInstalledItems, parseFilter, fileExists } from "./utils";

interface RemoveOptions {
	filter?: string;
	all?: boolean;
}

async function removeAgents(options: RemoveOptions): Promise<void> {
	const installed = await getInstalledItems(CONFIG.paths.agents);

	if (installed.length === 0) {
		console.log(chalk.yellow("\n⚠️  No agents installed"));
		return;
	}

	const filter = parseFilter(options.filter);
	const toRemove = options.all
		? installed
		: filter.length > 0
			? installed.filter((item) => filter.some((f) => item.includes(f)))
			: [];

	if (toRemove.length === 0) {
		console.log(chalk.yellow("\n⚠️  No matching agents to remove"));
		return;
	}

	console.log(chalk.cyan(`\n🗑️  Removing ${toRemove.length} agents...`));

	for (const item of toRemove) {
		const path = join(CONFIG.paths.agents, item);
		if (await fileExists(path)) {
			await rm(path);
			console.log(chalk.gray(`  ✓ Removed ${item}`));
		}
	}

	console.log(
		chalk.green(`\n✅ Successfully removed ${toRemove.length} agents`),
	);
}

async function removeDocs(options: RemoveOptions): Promise<void> {
	const installed = await getInstalledItems(CONFIG.paths.docs);

	if (installed.length === 0) {
		console.log(chalk.yellow("\n⚠️  No documentation installed"));
		return;
	}

	const filter = parseFilter(options.filter);
	const toRemove = options.all
		? installed
		: filter.length > 0
			? installed.filter((item) =>
					filter.some((f) => item.toLowerCase().includes(f.toLowerCase())),
				)
			: [];

	if (toRemove.length === 0) {
		console.log(chalk.yellow("\n⚠️  No matching documentation to remove"));
		return;
	}

	console.log(
		chalk.cyan(`\n🗑️  Removing ${toRemove.length} documentation files...`),
	);

	for (const item of toRemove) {
		const path = join(CONFIG.paths.docs, item);
		if (await fileExists(path)) {
			await rm(path);
			console.log(chalk.gray(`  ✓ Removed ${item}`));
		}
	}

	console.log(chalk.green(`\n✅ Successfully removed ${toRemove.length} docs`));
}

async function removeReference(options: RemoveOptions): Promise<void> {
	const installed = await getInstalledItems(CONFIG.paths.reference);

	if (installed.length === 0) {
		console.log(chalk.yellow("\n⚠️  No reference code installed"));
		return;
	}

	const filter = parseFilter(options.filter);
	const toRemove = options.all
		? installed
		: filter.length > 0
			? installed.filter((item) => filter.includes(item))
			: [];

	if (toRemove.length === 0) {
		console.log(chalk.yellow("\n⚠️  No matching reference code to remove"));
		return;
	}

	console.log(
		chalk.cyan(`\n🗑️  Removing ${toRemove.length} reference projects...`),
	);

	for (const item of toRemove) {
		const path = join(CONFIG.paths.reference, item);
		if (await fileExists(path)) {
			await rm(path, { recursive: true });
			console.log(chalk.gray(`  ✓ Removed ${item}`));
		}
	}

	console.log(
		chalk.green(
			`\n✅ Successfully removed ${toRemove.length} reference projects`,
		),
	);
}

export async function removeCommand(
	type?: string,
	options: RemoveOptions = {},
): Promise<void> {
	if (!type) {
		console.log(
			chalk.yellow(
				"\n⚠️  Please specify what to remove: agents, docs, reference, or all",
			),
		);
		return;
	}

	if (!isValidType(type)) {
		console.log(chalk.red(`\n❌ Invalid type: ${type}`));
		console.log(chalk.gray("Valid types: agents, docs, reference, all"));
		return;
	}

	if (!options.all && !options.filter) {
		console.log(
			chalk.yellow("\n⚠️  Please specify --all or --filter to remove items"),
		);
		return;
	}

	console.log(chalk.bold.cyan("\n🗑️  Claude Agents Remover"));
	console.log(chalk.gray("━".repeat(40)));

	try {
		switch (type) {
			case "agents":
				await removeAgents(options);
				break;
			case "docs":
				await removeDocs(options);
				break;
			case "reference":
				await removeReference(options);
				break;
			case "all":
				await removeAgents({ all: true });
				await removeDocs({ all: true });
				await removeReference({ all: true });
				break;
		}
	} catch (error) {
		console.error(chalk.red(`\n❌ Removal failed: ${error}`));
		process.exit(1);
	}
}
