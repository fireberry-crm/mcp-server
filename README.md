# Fireberry CRM MCP Server

<a target="_blank" href="https://fireberry.com" align="center" style="filter:drop-shadow(0 0 18px #fff) drop-shadow(0 0 12px #fff)">
<img alt="Fireberry's Logo" src="./docs/fireberry-logo.svg">

</a>

**A powerful Model Context Protocol (MCP) server for seamless AI-CRM integration**

[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40fireberry%2Fmcp-server.svg)](https://badge.fury.io/js/%40fireberry%2Fmcp-server)

</div>

Connect your AI assistants directly to [Fireberry CRM](https://fireberry.com) with secure, real-time access to your customer data. Perform complex CRM operations through natural language interactions.

## Quick Start

### 1. Get Your API Token

Generate your Fireberry API token following the [authentication guide](https://developers.fireberry.com/docs/authentication).

### 2. Install & Configure

Choose your preferred runtime:

#### Node.js (Recommended)

Add to your MCP configuration file:

```json
{
    "mcpServers": {
        "fireberry-crm": {
            "command": "npx",
            "args": ["-y", "@fireberry/mcp-server"],
            "env": {
                "FIREBERRY_TOKEN_ID": "<your-token-here>"
            }
        }
    }
}
```

#### Bun

```json
{
    "mcpServers": {
        "fireberry-crm": {
            "command": "bunx",
            "args": ["@fireberry/mcp-server"],
            "env": {
                "FIREBERRY_TOKEN_ID": "<your-token-here>"
            }
        }
    }
}
```

### 3. Tool-Specific Setup

<details>
<summary><strong>Claude Desktop</strong></summary>

Update `claude_desktop_config.json` [from MCP official docs](https://modelcontextprotocol.io/quickstart/user):

```json
{
    "mcpServers": {
        "fireberry-crm": {
            "command": "npx",
            "args": ["-y", "@fireberry/mcp-server"],
            "env": {
                "FIREBERRY_TOKEN_ID": "<your-token-here>"
            }
        }
    }
}
```

</details>

<details>
<summary><strong>VS Code (GitHub Copilot)</strong></summary>

Add to `.vscode/settings.json`:

```json
{
    "github.copilot.advanced": {
        "mcpServers": {
            "fireberry-crm": {
                "command": "npx",
                "args": ["-y", "@fireberry/mcp-server"],
                "env": {
                    "FIREBERRY_TOKEN_ID": "<your-token-here>"
                }
            }
        }
    }
}
```

</details>

<details>
<summary><strong>Cursor</strong></summary>

Navigate to Settings → MCP Servers and add:

```json
{
    "fireberry-crm": {
        "command": "npx",
        "args": ["-y", "@fireberry/mcp-server"],
        "env": {
            "FIREBERRY_TOKEN_ID": "<your-token-here>"
        }
    }
}
```

</details>

## Features

### 🔍 **Metadata & Discovery**

- `metadata_objects` — List all available CRM object types
- `metadata_fields` — Get field definitions for any object type
- `metadata_picklist` — Retrieve picklist values and options

### 🏗️ **Schema Management**

- `object_create` — Create new custom objects
- `field_create` — Add custom fields to existing objects

### 📝 **Record Operations**

- `record_create` — Create new records for any object type
- `record_update` — Update existing records with new values

## Usage Examples

Once configured, try these natural language prompts:

### Exploring Your Fireberry platform

```
"What object types are available in my Fireberry CRM?"
"Show me all fields for the Contacts object"
"List the picklist values for the Account Status field"
```

### Data Operations

```
"Create a new custom object called 'Projects' with description, and status fields"
"Add a 'Project Budget' currency field to the Projects object"
"Create a new project record called 'Q1 Digital Transformation'"
"Import this contacts.csv file into my CRM"
```

## Configuration

### Environment Variables

| Variable             | Required | Description              |
| -------------------- | -------- | ------------------------ |
| `FIREBERRY_TOKEN_ID` | ✅       | Your Fireberry API token |

## Security

- 🔐 All requests authenticated with your Fireberry API token
- 🔑 Token validation on startup

## Troubleshooting

### Common Issues

**Server not starting?**

- Verify your `FIREBERRY_TOKEN_ID` is correct
- Check that Node.js/Bun is properly installed
- Ensure network connectivity to `api.fireberry.com`

**Tools not appearing?**

- Restart your AI assistant after configuration
- Verify JSON syntax in configuration files
- Check MCP server logs for error messages

### Development Setup

```bash
git clone https://github.com/fireberry/mcp-server
cd mcp-server
npm install
npm run dev
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️‍🔥 by the <a href="https://fireberry.com">Fireberry</a> team
</div>
