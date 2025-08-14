# Fireberry MCP Server

A well-architected Model Context Protocol (MCP) server for the Fireberry CRM system. This server provides both **stdio** and **streamable HTTP** transports, making it suitable for local integrations (like Claude Desktop) and remote HTTP-based clients.

## Architecture

The server follows a modular, scalable architecture inspired by the official MCP examples:

```
src/
├── index.ts          # Main entry point (auto-detects transport)
├── server.ts         # Shared server configuration
├── stdio.ts          # Stdio transport entry point
├── http.ts           # HTTP transport entry point
├── tools/            # Tool implementations
├── resources/        # Resource implementations
├── prompts/          # Prompt templates
├── types/            # Shared TypeScript types
└── utils/            # Utility functions
```

## Features

### 🛠️ Tools

- **ping**: Simple connectivity test with optional message echo

### 📚 Resources

- **status://server**: Real-time server status and information

### ✉️ Prompts

- **help**: Get guidance on using the server (with optional topic filtering)

### 🚀 Dual Transport Support

- **Stdio**: Perfect for local integrations (Claude Desktop, VS Code, etc.)
- **HTTP**: Streamable HTTP with SSE for web applications and remote clients

## Quick Start

### Development Mode

```bash
# Auto-detect transport (defaults to stdio)
bun run dev

# Force stdio mode
bun run dev:stdio

# Force HTTP mode
bun run dev:http
```

### Production Mode

```bash
# Build first
bun run build

# Run with auto-detection
bun run start

# Or run specific transport
bun run start:stdio
bun run start:http
```

### Environment Variables

```bash
# Set transport mode
export MCP_TRANSPORT=http  # or 'stdio'

# Set log level
export LOG_LEVEL=debug     # debug, info, warn, error

# Set HTTP port (HTTP mode only)
export PORT=3001
```

## Transport Usage

### Stdio Transport (Local)

Perfect for Claude Desktop and local tools:

```json
// Claude Desktop config (~/.config/claude-desktop/claude_desktop_config.json)
{
    "mcpServers": {
        "fireberry-crm": {
            "command": "bun",
            "args": ["run", "dev:stdio"],
            "cwd": "/path/to/ServerPlatform/mcpServer"
        }
    }
}
```

### HTTP Transport (Remote)

Great for web applications and remote integrations:

```bash
# Start HTTP server
bun run dev:http

# Test with curl
curl http://localhost:3001/health

# Connect via MCP client
# POST http://localhost:3001/mcp
```

#### HTTP Endpoints

- `POST /mcp` - MCP JSON-RPC requests
- `GET /mcp` - Server-Sent Events (SSE) for real-time updates
- `DELETE /mcp` - Session termination
- `GET /health` - Health check endpoint

## Development

### Adding New Tools

1. Create tool schema in `src/tools/`
2. Register in `src/tools/index.ts`
3. Handle in `src/server.ts` CallToolRequestSchema

```typescript
// Example tool
const MyToolSchema = z.object({
  input: z.string().describe('Tool input'),
});

// Register in tools/index.ts
{
  name: 'my-tool',
  description: 'Description of my tool',
  inputSchema: zodToJsonSchema(MyToolSchema),
}

// Handle in server.ts
if (name === 'my-tool') {
  const { input } = MyToolSchema.parse(args);
  return {
    content: [{ type: 'text', text: `Result: ${input}` }]
  };
}
```

### Adding New Resources

1. Define resource in `src/resources/index.ts`
2. Handle in `src/server.ts` ReadResourceRequestSchema

### Adding New Prompts

1. Define prompt in `src/prompts/index.ts`
2. Handle in `src/server.ts` GetPromptRequestSchema

## Testing

### Using MCP Inspector

```bash
# Install MCP Inspector
npm install -g @modelcontextprotocol/inspector

# Test stdio mode
npx @modelcontextprotocol/inspector bun run src/stdio.ts

# Test built version
npx @modelcontextprotocol/inspector node dist/stdio.js
```

### Manual Testing

```bash
# Test ping tool via stdio
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"ping","arguments":{"message":"Hello"}}}' | bun run dev:stdio

# Test HTTP health endpoint
curl http://localhost:3001/health
```

## Architecture Benefits

✅ **Modular**: Easy to add new tools, resources, and prompts
✅ **Scalable**: Clean separation of concerns
✅ **Flexible**: Supports both local and remote usage
✅ **Type-Safe**: Full TypeScript support
✅ **Standards-Compliant**: Follows MCP best practices
✅ **Production-Ready**: Proper error handling and logging

## Next Steps

This is a solid foundation for your Fireberry CRM MCP server. To extend it:

1. **Add CRM-specific tools** (create-contact, search-contacts, etc.)
2. **Add real resources** (account data, dashboard metrics, etc.)
3. **Add helpful prompts** (email templates, report generation, etc.)
4. **Connect to your CRM database**
5. **Add authentication/authorization**
6. **Deploy to production**

The modular architecture makes it easy to grow from this simple scaffold into a comprehensive CRM integration.
