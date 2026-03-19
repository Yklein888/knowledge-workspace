# Knowledge Workspace

A Notion-like smart knowledge management system with embedded AI agent and MCP builder.

## System Architecture

### Two Core Systems

1. **Knowledge Workspace** (Internal)
   - Pages, documents, databases
   - Rich text editor
   - Linking and relationships
   - Organization system

2. **Agent & MCP Builder** (Tool)
   - Create intelligent AI agents
   - Build MCP integrations
   - Export agents for external use
   - Visual configuration interface

## Tech Stack

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Database**: Supabase (PostgreSQL) + Drizzle ORM
- **Deployment**: Vercel
- **Package Manager**: npm
- **Node Version**: 20.x

## Getting Started

### Prerequisites

- Node.js 20.x
- Supabase account
- Vercel account (for deployment)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Development

```bash
# Start dev server
npm run dev

# Open browser
open http://localhost:3000
```

### Database

```bash
# Push schema to database
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

## Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
├── db/              # Database schema & migrations
├── hooks/           # Custom React hooks
├── lib/             # Utilities & helpers
└── types/           # TypeScript types

vercel.json         # Vercel deployment config
drizzle.config.ts   # Database config
```

## MVP Features (Phase 1)

- [x] Project structure
- [x] Database schema
- [ ] Authentication (Supabase Auth)
- [ ] Pages & documents CRUD
- [ ] Basic editor
- [ ] Linking system
- [ ] Agent export format

## Deployment

```bash
# Deploy to Vercel
vercel deploy --prod
```

## License

MIT
