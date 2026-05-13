1. Add MCP server
Add the MCP server to your project config using the command line.
Code:
File: Code
```
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=mtqwroijalkjkszggnva&features=branching%2Cfunctions%2Cdevelopment%2Cdebugging%2Cdatabase%2Caccount%2Cdocs"
```

2. Authenticate
After configuring the MCP server, you need to authenticate. In a regular terminal (not the IDE extension) run:
Details:
Select the supabase server, then Authenticate to begin the flow.
Code:
File: Code
```
claude /mcp
```

3. Install Agent Skills (Optional)
Agent Skills give AI coding tools ready-made instructions, scripts, and resources for working with Supabase more accurately and efficiently.
Details:
npx skills add supabase/agent-skills
Code:
File: Code
```
npx skills add supabase/agent-skills
```