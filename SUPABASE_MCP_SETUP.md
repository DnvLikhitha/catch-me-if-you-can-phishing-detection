# Supabase MCP Server Setup Guide

## What is Supabase MCP?

The Supabase Model Context Protocol (MCP) server allows AI assistants like Claude to directly interact with your Supabase projects. It provides tools for:
- Managing databases (creating tables, executing SQL, migrations)
- Managing Edge Functions
- Managing authentication and storage
- Reading logs and advisors
- Working with development branches

## Prerequisites

1. **Node.js and npm/npx** - Ensure you have Node.js installed (version 16 or higher)
2. **Supabase Account** - You need an active Supabase account with at least one project
3. **Supabase Access Token** - A personal access token from Supabase

## Step-by-Step Setup

### Step 1: Get Your Supabase Access Token

1. Go to [https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
2. Click "Generate New Token"
3. Give it a descriptive name (e.g., "MCP Server Token")
4. Set appropriate permissions (for full access, enable all scopes)
5. Copy the token - **save it securely, you won't see it again**

### Step 2: Get Your Project Reference ID

1. Go to your Supabase Dashboard
2. Select your project
3. Go to Settings → General
4. Find "Reference ID" - this is your `project-ref`
5. It looks something like: `abcdefghijklmnopqrst`

### Step 3: Create MCP Configuration File

For **VS Code (Claude Desktop or similar)**:

The MCP configuration file location depends on your OS:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

If you're using VS Code with the Copilot MCP feature, the configuration file might be in:
- `%USERPROFILE%\.vscode\mcp.json` (Windows)
- Or within your workspace: `.vscode/mcp.json`

### Step 4: Configure the MCP Server

Add the following configuration to your MCP configuration file:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_ACCESS_TOKEN_HERE"
      }
    }
  }
}
```

**Important Configuration Options:**

You can add additional environment variables for more control:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_xxxxxxxxxxxxxxxxxxxxx",
        "SUPABASE_PROJECT_REF": "your-project-ref-id",
        "SUPABASE_READ_ONLY": "false",
        "SUPABASE_API_URL": "https://api.supabase.com"
      }
    }
  }
}
```

### Step 5: Environment Variables Explained

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SUPABASE_ACCESS_TOKEN` | **Yes** | Your personal access token from Supabase | `sbp_xxxxxxxxxxxxx` |
| `SUPABASE_PROJECT_REF` | No | Default project reference ID | `abcdefghijklmnopqrst` |
| `SUPABASE_READ_ONLY` | No | Restricts to read-only operations | `true` or `false` |
| `SUPABASE_API_URL` | No | Custom API URL (usually not needed) | `https://api.supabase.com` |

### Step 6: Alternative - Local Environment File

You can also create a `.env` file in your project root:

```env
SUPABASE_ACCESS_TOKEN=sbp_your_token_here
SUPABASE_PROJECT_REF=your_project_ref_id
SUPABASE_READ_ONLY=false
```

Then reference it in your MCP config:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

### Step 7: Restart Your Application

After configuring the MCP server:
1. Close VS Code or Claude Desktop completely
2. Reopen the application
3. The MCP server will automatically start when needed

### Step 8: Verify the Connection

Once your application restarts, you can verify the connection by asking your AI assistant:

- "List my Supabase projects"
- "Show me the tables in my database"
- "What are the current Supabase advisors?"

The AI should now be able to interact with your Supabase project directly.

## Available MCP Tools

Once connected, the following capabilities are available:

### Project Management
- `list_projects` - List all your Supabase projects
- `get_project` - Get details about a specific project
- `create_project` - Create a new project
- `pause_project` / `restore_project` - Pause/restore projects

### Database Operations
- `execute_sql` - Execute SQL queries (SELECT, INSERT, UPDATE, DELETE)
- `apply_migration` - Apply database migrations (DDL)
- `list_migrations` - View migration history
- `list_tables` - List database tables
- `list_extensions` - List installed PostgreSQL extensions
- `generate_typescript_types` - Generate TypeScript types from your schema

### Edge Functions
- `list_edge_functions` - List all Edge Functions
- `get_edge_function` - Get function code
- `deploy_edge_function` - Deploy a new or update existing function

### Development Branches
- `list_branches` - List development branches
- `create_branch` - Create a new branch
- `merge_branch` - Merge branch to production
- `rebase_branch` - Rebase branch on production
- `reset_branch` - Reset branch migrations
- `delete_branch` - Delete a branch

### Monitoring & Debugging
- `get_logs` - Fetch logs by service (api, auth, postgres, etc.)
- `get_advisors` - Get security and performance advisories

### Keys & Configuration
- `get_publishable_keys` - Get API keys for your project
- `get_project_url` - Get the project's API URL

## Security Best Practices

1. **Never commit your access token** - Add `.env` to `.gitignore`
2. **Use read-only mode for testing** - Set `SUPABASE_READ_ONLY=true` when experimenting
3. **Rotate tokens regularly** - Generate new tokens periodically
4. **Use minimal scopes** - Only grant necessary permissions to your token
5. **Store tokens securely** - Use environment variables or secure vaults

## Troubleshooting

### Issue: "Cannot find module '@supabase/mcp-server-supabase'"
**Solution**: Ensure you have internet connectivity. The `-y` flag in npx will auto-install the package.

### Issue: "Invalid access token"
**Solution**: 
- Verify your token is correct
- Check if the token has expired
- Ensure the token has the necessary scopes
- Generate a new token from Supabase dashboard

### Issue: "Project not found"
**Solution**:
- Verify your project reference ID
- Ensure the project exists in your Supabase account
- Check if your access token has access to this project

### Issue: MCP server not starting
**Solution**:
- Check if Node.js is installed: `node --version`
- Check if npx is available: `npx --version`
- Look at application logs for error messages
- Try running the command manually: `npx -y @supabase/mcp-server-supabase@latest`

## Example Workflows

### 1. Create a New Table

Ask your AI: "Create a new table called 'users' with columns id, email, and created_at"

### 2. Query Your Database

Ask your AI: "Show me all records from the users table"

### 3. Deploy an Edge Function

Ask your AI: "Deploy a new Edge Function called 'hello-world' that returns a JSON response"

### 4. Check Security Advisors

Ask your AI: "Check for security advisories in my Supabase project"

### 5. Generate TypeScript Types

Ask your AI: "Generate TypeScript types for my database schema"

## Additional Resources

- [Supabase MCP Documentation](https://github.com/supabase/mcp-server-supabase)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase API Reference](https://supabase.com/docs/reference)

## Next Steps

1. ✅ Get your Supabase access token
2. ✅ Get your project reference ID
3. ✅ Create the MCP configuration file
4. ✅ Add your credentials
5. ✅ Restart your application
6. ✅ Test the connection
7. ✅ Start building with AI assistance!

---

**Note**: This setup enables powerful AI-assisted development with direct database access. Always review AI-generated SQL and migrations before applying them to production databases.
