/**
 * Install command implementation
 */

import chalk from "chalk";
import { join } from "node:path";
import {
	CONFIG,
	type InstallType,
	isValidType,
	getGithubRawUrl,
	getGithubApiUrl,
} from "./config";
import {
	ensureDir,
	downloadFile,
	fileExists,
	printProgress,
	parseFilter,
	fetchGithubContent,
} from "./utils";

interface InstallOptions {
	filter?: string;
	dir?: string;
	force?: boolean;
	dryRun?: boolean;
}

async function getManifest(): Promise<any> {
	console.log(chalk.cyan("📋 Fetching manifest..."));
	const manifestUrl = getGithubRawUrl("manifest.json");
	const response = await fetch(manifestUrl);
	if (!response.ok) {
		throw new Error(
			"Failed to fetch manifest. Repository might not be set up yet.",
		);
	}
	return response.json();
}

async function installAgents(options: InstallOptions): Promise<void> {
	const targetDir = options.dir || CONFIG.paths.agents;
	await ensureDir(targetDir);

	try {
		const manifest = await getManifest();
		const agents = manifest.agents || [];
		const filter = parseFilter(options.filter);

		const toInstall =
			filter.length > 0
				? agents.filter((a: any) => filter.includes(a.name))
				: agents;

		if (options.dryRun) {
			console.log(chalk.yellow("\n🔍 Dry run - would install:"));
			toInstall.forEach((agent: any) => {
				console.log(chalk.gray(`  - ${agent.name}`));
			});
			return;
		}

		console.log(chalk.cyan(`\n📦 Installing ${toInstall.length} agents...`));

		for (let i = 0; i < toInstall.length; i++) {
			const agent = toInstall[i];
			const destPath = join(targetDir, agent.filename);

			if ((await fileExists(destPath)) && !options.force) {
				console.log(
					chalk.yellow(
						`  ⚠️  ${agent.name} already exists (use --force to overwrite)`,
					),
				);
				continue;
			}

			printProgress(i + 1, toInstall.length, `Installing ${agent.name}`);
			const url = getGithubRawUrl(`assets/agents/${agent.filename}`);
			await downloadFile(url, destPath);
		}

		console.log(
			chalk.green(
				`\n✅ Successfully installed ${toInstall.length} agents to ${targetDir}`,
			),
		);
	} catch (error) {
		console.error(chalk.red(`\n❌ Error installing agents: ${error}`));
		throw error;
	}
}

async function installDocs(options: InstallOptions): Promise<void> {
	const targetDir = options.dir || CONFIG.paths.docs;
	await ensureDir(targetDir);

	try {
		const manifest = await getManifest();
		const docs = manifest.docs || [];
		const filter = parseFilter(options.filter);

		const toInstall =
			filter.length > 0
				? docs.filter((d: any) =>
						filter.some((f: string) =>
							d.name.toLowerCase().includes(f.toLowerCase()),
						),
					)
				: docs;

		if (options.dryRun) {
			console.log(chalk.yellow("\n🔍 Dry run - would install:"));
			toInstall.forEach((doc: any) => {
				console.log(chalk.gray(`  - ${doc.name}`));
			});
			return;
		}

		console.log(
			chalk.cyan(`\n📚 Installing ${toInstall.length} documentation files...`),
		);

		for (let i = 0; i < toInstall.length; i++) {
			const doc = toInstall[i];
			const destPath = join(targetDir, doc.filename);

			if ((await fileExists(destPath)) && !options.force) {
				console.log(
					chalk.yellow(
						`  ⚠️  ${doc.name} already exists (use --force to overwrite)`,
					),
				);
				continue;
			}

			printProgress(i + 1, toInstall.length, `Installing ${doc.name}`);
			const url = getGithubRawUrl(`assets/docs/${doc.filename}`);
			await downloadFile(url, destPath);
		}

		console.log(
			chalk.green(
				`\n✅ Successfully installed ${toInstall.length} docs to ${targetDir}`,
			),
		);
	} catch (error) {
		console.error(chalk.red(`\n❌ Error installing docs: ${error}`));
		throw error;
	}
}

async function installReference(options: InstallOptions): Promise<void> {
	const targetDir = options.dir || CONFIG.paths.reference;
	await ensureDir(targetDir);

	try {
		const manifest = await getManifest();
		const references = manifest.reference || [];
		const filter = parseFilter(options.filter);

		const toInstall =
			filter.length > 0
				? references.filter((r: any) => filter.includes(r.name))
				: references;

		if (options.dryRun) {
			console.log(chalk.yellow("\n🔍 Dry run - would install:"));
			toInstall.forEach((ref: any) => {
				console.log(chalk.gray(`  - ${ref.name}`));
			});
			return;
		}

		console.log(
			chalk.cyan(
				`\n📂 Installing ${toInstall.length} reference code projects...`,
			),
		);

		for (let i = 0; i < toInstall.length; i++) {
			const ref = toInstall[i];
			const projectDir = join(targetDir, ref.name);

			if ((await fileExists(projectDir)) && !options.force) {
				console.log(
					chalk.yellow(
						`  ⚠️  ${ref.name} already exists (use --force to overwrite)`,
					),
				);
				continue;
			}

			printProgress(i + 1, toInstall.length, `Installing ${ref.name}`);

			// Download all files for this reference project
			for (const file of ref.files) {
				const url = getGithubRawUrl(
					`assets/reference_code/${ref.name}/${file}`,
				);
				const destPath = join(projectDir, file);
				await downloadFile(url, destPath);
			}
		}

		console.log(
			chalk.green(
				`\n✅ Successfully installed ${toInstall.length} reference projects to ${targetDir}`,
			),
		);
	} catch (error) {
		console.error(chalk.red(`\n❌ Error installing reference code: ${error}`));
		throw error;
	}
}

export async function installCommand(
	type?: string,
	options: InstallOptions = {},
): Promise<void> {
	if (!type) {
		console.log(
			chalk.yellow(
				"\n⚠️  Please specify what to install: agents, docs, reference, or all",
			),
		);
		return;
	}

	if (!isValidType(type)) {
		console.log(chalk.red(`\n❌ Invalid type: ${type}`));
		console.log(chalk.gray("Valid types: agents, docs, reference, all"));
		return;
	}

	console.log(chalk.bold.cyan("\n🚀 Claude Agents Installer"));
	console.log(chalk.gray("━".repeat(40)));

	try {
		switch (type) {
			case "agents":
				await installAgents(options);
				break;
			case "docs":
				await installDocs(options);
				break;
			case "reference":
				await installReference(options);
				break;
			case "all":
				await installAgents(options);
				await installDocs(options);
				await installReference(options);
				break;
		}
	} catch (error) {
		console.error(chalk.red("\n❌ Installation failed"));
		process.exit(1);
	}
}
