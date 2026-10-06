#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from '../server/mcp.mjs';
import { call, workspace, baseURL } from '../server/client.mjs';
if (process.argv.includes('--help')) {
  process.stdout.write('Cordis MCP 0.3 — stdio\nCORDIS_URL=https://your-cordis-app\nCORDIS_TOKEN=<revocable API key>\nCORDIS_WORKSPACE=<optional workspace UUID>\nNever put a key in command arguments.\n');
} else {
  if (!process.env.CORDIS_TOKEN) process.stderr.write('Cordis MCP: configure CORDIS_TOKEN; discovery works, private calls require your key.\n');
  await createMcpServer({call,defaultWorkspace:workspace,publicURL:baseURL}).connect(new StdioServerTransport());
}
