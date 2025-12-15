# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a model comparison website that displays AI model pricing, benchmarks, and metadata from various cloud vendors. Built with Astro, React, and Tailwind CSS, it features a client-side SQL engine (sql.js) for querying model data.

## Commands

- `npm run dev` - Start development server (localhost:4321)
- `npm run build` - Build for production
- `npm run init` - Run scrapers to generate `public/data.json`

## Architecture

### Data Pipeline

1. **Scrapers** (`scraper/`) fetch model data from vendor APIs (currently AWS Bedrock)
2. Scrapers output to `public/data.json` following the `DataFormat` type
3. At build time, `src/pages/data.db.ts` converts JSON to SQLite database
4. Client-side sql.js workers query the database for table display

### Key Files

- `src/dataFormat.d.ts` - Core type definitions for vendors and models
- `src/sql/schema.ts` - SQLite schema definition
- `scraper/constants.ts` - Model metadata (reasoning capability, self-hostable status, benchmark data fetching)
- `src/constants.ts` - Default table column queries
- `src/state.ts` - Client-side state management with localStorage persistence
- `src/sqlEngine.ts` - Web worker pool for SQL queries

### Adding New Vendors

1. Create scraper in `scraper/scrapers/`
2. Add scraper call to `scraper/runner.ts`
3. Update `PROVIDERS` map in `scraper/scrapers/aws.ts` (or move to shared constants)
4. Update `MODEL_REASONING_PREFIXES` and `isSelfHostableModel()` in `scraper/constants.ts` for new model families

### Path Alias

Use `@/src/*` to import from the `src/` directory (configured in tsconfig.json).
