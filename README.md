# Claude Agents Installer

A CLI tool to install and manage Claude agents, documentation, and reference code.

## 🚀 Quick Start

### Install with one command:

```bash
# Universal installer (auto-detects OS)
curl -fsSL https://raw.githubusercontent.com/phyter1/claude-agents-installer/main/scripts/install.sh | bash

# Or for Windows PowerShell
iwr -useb https://raw.githubusercontent.com/phyter1/claude-agents-installer/main/scripts/install-windows.ps1 | iex
```

## 📦 What Gets Installed

- **Agents**: Specialized AI agents for various development tasks
- **Documentation**: Comprehensive docs for popular JavaScript/TypeScript libraries  
- **Reference Code**: Example projects and boilerplate code

## 🛠️ Usage

```bash
# Install everything
claude-agents install all

# Install specific types
claude-agents install agents
claude-agents install docs
claude-agents install reference

# Install with filters
claude-agents install docs --filter "bun,typescript"
claude-agents install agents --filter "react-developer,system-architect"

# List available resources
claude-agents list
claude-agents list agents --available
claude-agents list docs --installed

# Check installation status
claude-agents status

# Update installed resources
claude-agents update all

# Remove resources
claude-agents remove docs --filter "old-library"
claude-agents remove agents --all

# Show help
claude-agents --help
```

## 📍 Installation Locations

By default, resources are installed to:
- **Agents**: `~/.claude/agents/`
- **Documentation**: `~/.claude/docs/`
- **Reference Code**: `~/.claude/reference_code/`

You can specify custom directories with the `--dir` option:
```bash
claude-agents install agents --dir ~/my-agents
```

## 🤖 Available Agents

- `docs-researcher` - Research documentation for JS/TS libraries
- `react-developer` - Expert React and Next.js development
- `system-architect` - Design and architect applications
- `task-breakdown` - Break down complex tasks into subtasks
- `task-documenter` - Create comprehensive documentation
- `task-planner` - Plan complex TypeScript development tasks
- `test-task-planner` - Create comprehensive test plans
- `typescript-code-reviewer` - Review TypeScript code quality
- `typescript-developer` - Implement complex TypeScript features
- `typescript-reference-developer` - Generate reference implementations
- `typescript-test-developer` - Generate and maintain tests

## 📚 Documentation Categories

- **Bun** - Runtime, build tools, and workspace management
- **React/Next.js** - React, Next.js, and related libraries
- **TypeScript** - TypeScript configuration and best practices
- **API** - Hono framework and OpenAPI specifications
- **Database** - Drizzle ORM and database tools
- **UI/Styling** - TailwindCSS, shadcn/ui components
- **Testing** - Testing frameworks and strategies
- **Claude Code** - Claude Code SDK and integrations

## 🔧 Development

### Prerequisites
- [Bun](https://bun.sh) runtime

### Setup
```bash
git clone https://github.com/phyter1/claude-agents-installer.git
cd claude-agents-installer
bun install
```

### Build
```bash
# Build for current platform
bun run build

# Build for all platforms
bun run build:cross

# Generate installers
bun run installers
```

### Testing
```bash
bun test
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🔗 Links

- [GitHub Repository](https://github.com/phyter1/claude-agents-installer)
- [Report Issues](https://github.com/phyter1/claude-agents-installer/issues)
