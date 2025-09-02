# Contributing to Claude Agents Installer

Thank you for your interest in contributing to Claude Agents Installer! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive environment for all contributors.

## How to Contribute

### Reporting Issues

- Check if the issue already exists
- Provide clear description and steps to reproduce
- Include system information (OS, Bun version, etc.)
- Add relevant error messages or screenshots

### Suggesting Features

- Open an issue with the "enhancement" label
- Describe the use case and benefits
- Provide examples if applicable

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`bun test`)
5. Run linting (`bun run lint`)
6. Commit with descriptive message
7. Push to your fork
8. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/claude-agents-installer.git
cd claude-agents-installer

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

## Adding New Resources

### Adding Agents

1. Add the agent markdown file to `assets/agents/`
2. Update the manifest: `bun run create-manifest.js`
3. Test installation: `bun run src/index.ts install agents`

### Adding Documentation

1. Add documentation files to `assets/docs/`
2. Ensure proper categorization in `create-manifest.js`
3. Update the manifest
4. Test installation

### Adding Reference Code

1. Create a new directory in `assets/reference_code/`
2. Add all necessary files
3. Update the manifest
4. Test installation

## Code Style

- Use TypeScript for all new code
- Follow existing patterns and conventions
- Use tabs for indentation (configured in Biome)
- Write clear, self-documenting code
- Add comments for complex logic

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Test on multiple platforms if possible

## Documentation

- Update README.md for user-facing changes
- Update CLAUDE.md for development changes
- Add JSDoc comments for public functions

## Release Process

Maintainers will handle releases, which involve:

1. Updating version in package.json
2. Building for all platforms
3. Generating installers
4. Creating GitHub release
5. Updating installation scripts

## Questions?

Feel free to open an issue for any questions about contributing.