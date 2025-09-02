#!/usr/bin/env bun

/**
 * Claude Agents Installer CLI
 * Install and manage Claude agents, documentation, and reference code
 */

import { program } from "commander";
import chalk from "chalk";
import { installCommand } from "./lib/install";
import { listCommand } from "./lib/list";
import { updateCommand } from "./lib/update";
import { removeCommand } from "./lib/remove";
import { statusCommand } from "./lib/status";
import { CONFIG } from "./lib/config";

// CLI Setup
program
	.name("claude-agents")
	.description(
		"Install and manage Claude agents, documentation, and reference code",
	)
	.version("1.0.0");

// Install command
program
	.command("install [type]")
	.description("Install agents, docs, reference code, or all")
	.option("-f, --filter <items>", "Filter items to install (comma-separated)")
	.option("-d, --dir <directory>", "Custom installation directory")
	.option("--force", "Force overwrite existing files")
	.option(
		"--dry-run",
		"Show what would be installed without actually installing",
	)
	.action(async (type, options) => {
		await installCommand(type, options);
	});

// List command
program
	.command("list [type]")
	.description("List available agents, docs, or reference code")
	.option("-i, --installed", "Show only installed items")
	.option("-a, --available", "Show only available items")
	.action(async (type, options) => {
		await listCommand(type, options);
	});

// Update command
program
	.command("update [type]")
	.description("Update installed agents, docs, or reference code from GitHub")
	.option("-f, --force", "Force update even if already up to date")
	.action(async (type, options) => {
		await updateCommand(type, options);
	});

// Remove command
program
	.command("remove [type]")
	.description("Remove installed agents, docs, or reference code")
	.option("-f, --filter <items>", "Filter items to remove (comma-separated)")
	.option("--all", "Remove all items of the specified type")
	.action(async (type, options) => {
		await removeCommand(type, options);
	});

// Status command
program
	.command("status")
	.description("Show installation status and statistics")
	.action(async () => {
		await statusCommand();
	});

// Info command
program
	.command("info")
	.description("Show installation paths and configuration")
	.action(() => {
		console.log(chalk.bold.cyan("\n📍 Installation Paths:"));
		console.log(chalk.gray("  Agents:         ") + CONFIG.paths.agents);
		console.log(chalk.gray("  Documentation:  ") + CONFIG.paths.docs);
		console.log(chalk.gray("  Reference Code: ") + CONFIG.paths.reference);
		console.log(chalk.gray("  Cache:          ") + CONFIG.paths.cache);
		console.log();
		console.log(chalk.bold.cyan("🔗 GitHub Repository:"));
		console.log(chalk.gray("  ") + CONFIG.github.repo);
		console.log();
	});

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
	program.outputHelp();
}
