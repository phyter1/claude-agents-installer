
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CLI tool for installing and managing Claude agents, documentation, and reference code. Built with Bun and TypeScript using Commander.js for CLI commands.

## Essential Commands

```bash
# Development
bun install                  # Install dependencies
bun run src/index.ts        # Run CLI in development
bun test                    # Run tests (currently no tests written)
bun run lint                # Run Biome linter
bun run lint:fix            # Fix linting issues
bun run typecheck           # TypeScript type checking
bun run quality:check       # Run lint, typecheck, and tests together

# Building & Release
bun run build               # Build executable for current platform
bun run build:cross         # Build for all platforms (macOS, Linux, Windows)
bun run installers          # Generate platform-specific installers
bun run release             # Full release build (cross-platform + installers)
```

## Architecture

### Core Components

**Command Structure** (src/lib/):
- Each command (`install`, `list`, `update`, `remove`, `status`) is a separate module
- Commands fetch resources from GitHub using the manifest.json
- Installation paths default to `~/.claude/` with subdirectories for agents, docs, and reference_code

**Configuration** (src/lib/config.ts):
- Central configuration for paths, GitHub repository details, and valid resource types
- Assets repository: `phyter1/claude-code-assets`
- Resources fetched from raw GitHub content

**Asset Management**:
- Assets are stored in a separate repository: `phyter1/claude-code-assets`
- `manifest.json` in the assets repository contains metadata for all available resources
- Includes file sizes, descriptions, and categorization for docs

### Resource Types

1. **Agents**: Markdown files defining specialized AI agents
2. **Docs**: Documentation for JavaScript/TypeScript libraries
3. **Reference Code**: Example projects and boilerplate code

### Key Implementation Details

- **GitHub-based distribution**: All resources fetched from GitHub at install time
- **Filter support**: Commands accept `--filter` for selective installation/removal
- **Dry-run mode**: `--dry-run` shows what would be done without executing
- **Force mode**: `--force` overwrites existing files
- **Custom directories**: `--dir` option for non-default installation paths

## Code Style

- **Formatter**: Biome with tab indentation and double quotes
- **TypeScript**: Strict mode enabled, ESNext target
- **Module System**: ESM with Bun's bundler resolution
- **Error Handling**: Commands throw errors that are caught at the top level
