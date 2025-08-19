# Fireberry CRM MCP Server

🚀 A powerful Model Context Protocol (MCP) server that enables AI assistants to interact with Fireberry CRM. Get instant, secure access to your CRM data through your favorite AI tools.

[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Available Tools

### CRM Tools

- **Metadata Management**
    - `metadata_objects`: List all available CRM object types
    - `metadata_fields`: Get field definitions for any object type
    - `metadata_picklist`: Retrieve picklist values for fields

- **Object Management**
    - `object_create`: Create new custom objects in your CRM
    - `field_create`: Add custom fields to existing objects

- **Record Operations**
    - `record_create`: Create new records for any object type
    - `record_update`: Update existing records with new values

## 🚀 Integration Guide

### Using Node.js (npx)

```json
{
    "command": "npx",
    "args": ["-y", "@fireberry/mcp-server"]
}
```

### Using Bun

```json
{
    "command": "bunx",
    "args": ["@fireberry/mcp-server"]
}
```

### Tool-Specific Configuration

#### Claude Desktop & Claude

In `~/.config/claude-desktop/claude_desktop_config.json` or Claude settings:

```json
{
    "mcpServers": {
        "fireberry": {
            // Use Node.js or Bun config from above
        }
    }
}
```

#### VS Code (Copilot)

In `.vscode/settings.json`:

```json
{
    "github.copilot.advanced": {
        "mcpServers": {
            "fireberry": {
                // Use Node.js or Bun config from above
            }
        }
    }
}
```

#### Cursor

In Cursor settings → MCP Servers:

```json
{
    "fireberry": {
        // Use Node.js or Bun config from above
    }
}
```

#### Other Tools

- **Cline**: Add to `~/.config/cline/config.json`
- **Windsurf**: Configure in Settings → Integrations
- **Roo Code**: Add via Extensions → MCP Servers
- **Visual Studio**: Configure through AI Tools → MCP Settings

### Example Prompts

Try these prompts with your AI assistant:

#### Exploring Your CRM

```
"Show me all the available object types in my CRM"
"What fields are available for the Contacts object?"
"List all picklist options for the Status field"
```

#### Creating Objects and Fields

```
"Create a new custom object called Projects"
"Add a text field called Project Code to the Projects object"
"Create a new Project record with name 'Q1 Initiative'"
```

## ⚙️ Configuration

### Environment Variables

```bash
# Required
FIREBERRY_TOKEN_ID=your-user-token-id
```

## 🔒 Security

- All requests are authenticated using your Fireberry token
- Data encryption in transit

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 [Documentation](https://docs.fireberry.com/mcp)
- 💬 [Community Forum](https://community.fireberry.com)
- 📧 [Email Support](mailto:support@fireberry.com)

---

Built with ❤️‍🔥 by the Fireberry Team
