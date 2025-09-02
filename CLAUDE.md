
# Claude Agents Installer - Development Notes

## Project Overview

This is a CLI tool for installing and managing Claude agents, documentation, and reference code. It's built with Bun and TypeScript, following the same patterns as the tts-cli project.

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **CLI Framework**: Commander.js
- **Styling**: Chalk for terminal colors
- **Linting**: Biome
- **Build**: Bun's native compiler

## Project Structure

```
claude-agents-installer/
├── src/
│   ├── index.ts          # Main CLI entry point
│   └── lib/
│       ├── config.ts     # Configuration and constants
│       ├── utils.ts      # Utility functions
│       ├── install.ts    # Install command
│       ├── list.ts       # List command
│       ├── update.ts     # Update command
│       ├── remove.ts     # Remove command
│       └── status.ts     # Status command
├── assets/
│   ├── agents/           # Agent markdown files
│   ├── docs/             # Documentation files
│   └── reference_code/   # Reference code projects
├── scripts/
│   ├── build.sh          # Build script
│   ├── build-cross-platform.sh
│   └── generate-installers.sh
├── manifest.json         # Resource manifest
└── create-manifest.js    # Manifest generator

```

## Commands

### Development

```bash
# Install dependencies
bun install

# Run in development
bun run src/index.ts

# Run tests
bun test

# Lint code
bun run lint

# Type check
bun run typecheck
```

### Building

```bash
# Build for current platform
bun run build

# Build for all platforms
bun run build:cross

# Generate installers
bun run installers
```

## Key Design Decisions

1. **GitHub-based Distribution**: Resources are fetched from the GitHub repository, making updates easy without rebuilding the CLI.

2. **Manifest-driven**: A `manifest.json` file lists all available resources with metadata.

3. **Self-contained Installers**: Platform-specific installers embed the binary for easy distribution.

4. **Flexible Installation**: Users can install all resources or filter specific ones.

## Testing Strategy

- Unit tests for utility functions
- Integration tests for commands
- End-to-end tests for installation flow

## Deployment Process

1. Update assets in the repository
2. Run `bun run create-manifest.js` to update manifest
3. Build executables with `bun run build:cross`
4. Generate installers with `bun run installers`
5. Commit and push to GitHub
6. Create a GitHub release with the installers

## Future Enhancements

- [ ] Version management for resources
- [ ] Dependency resolution for agents
- [ ] Interactive installation mode
- [ ] Resource search functionality
- [ ] Custom resource repositories
- [ ] Offline mode with bundled resources
