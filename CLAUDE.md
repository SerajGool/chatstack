# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Geist (Sans and Mono)

## Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run type checking
npm run typecheck

# Run tests
npm test
```

## Architecture Highlights
- **Frontend Framework**: Next.js 15 with App Router
- **State Management**: React hooks (useState)
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - Custom UI components in `/components/ui/`
- **Routing**: 
  - File-based routing in `/app/`
  - Dynamic routes supported (e.g., `[slug]` patterns)

## Key Architectural Patterns
- Client-side components marked with `"use client"`
- Metadata defined in `layout.tsx`
- Modular UI components with reusable Shadcn/ui components
- Gradient and responsive design approach
- Internationalization considerations (Latin font subsets)

## Environment Configuration
- Uses `.env.local` for environment-specific configurations
- Supports Next.js 15 environment handling

## Performance Considerations
- Uses client-side state management
- Implements lazy loading and dynamic imports
- Responsive design with mobile-first approach

## Security Notes
- Uses client-side form handling
- Placeholder for future authentication flows
- Simulated form submissions with client-side alerts

## Deployment Considerations
- Vercel-ready configuration
- Supports TypeScript type checking
- Optimized for production builds