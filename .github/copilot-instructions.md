# Hofman Core Quadrant - AI Coding Instructions

## Project Overview

Quasar v2 + Vue 3 + TypeScript MVP for an Ofman Quadrant Generator. Client-side only app that uses OpenAI GPT-4o-mini to generate personality quadrant suggestions based on user input.

## Tech Stack & Architecture

- **Framework**: Quasar v2 (Vue 3 + Vite)
- **Language**: TypeScript (strict mode enabled)
- **Router**: Vue Router with hash mode
- **i18n**: vue-i18n (en-US default, composition API only)
- **State**: Composables-based (no Pinia/Vuex)
- **Styling**: SCSS + Quasar components

## Critical Development Commands

```bash
# Development (auto-opens browser)
quasar dev

# Build
quasar build

# Lint (flat config with TypeScript support)
npm run lint

# Format (Prettier)
npm run format

# Test (Vitest with watch mode)
npm test

# Test with UI
npm run test:ui

# Test with coverage
npm run test:coverage
```

## Project Structure Conventions

```
src/
  boot/          # Quasar boot files (e.g., i18n.ts)
  components/    # Presentational Vue components (no logic)
  composables/   # Testable logic layer (5 core composables implemented)
  layouts/       # Layout wrappers (MainLayout.vue)
  pages/         # Page components (IndexPage.vue)
  router/        # Route definitions
  i18n/          # Translation files (en-US/index.ts)
tests/
  composables/   # Vitest tests for business logic
```

## Key Architectural Decisions

### 1. Composables-First Logic Pattern

All business logic lives in **composables** in `src/composables/`:

- `useApiKey.ts` - OpenAI API key management (localStorage)
- `useLanguage.ts` - Language selection and persistence
- `useQuadrantState.ts` - Ofman quadrant state management
- `usePromptBuilder.ts` - GPT prompt construction
- `useOfmanGenerator.ts` - OpenAI API integration

Components are presentational only. See `KNOWLEDGE_BASED.md` section 3.2 for architecture details.

### 2. Component Import Pattern

Import components WITHOUT file extensions:

```typescript
import ExampleComponent from 'components/ExampleComponent.vue';
import type { Todo } from 'components/models';
```

Quasar's Vite config handles path resolution automatically.

### 3. i18n Usage

- Boot file: `src/boot/i18n.ts` (composition API mode, legacy: false)
- Default locale: `en-US`
- Type-safe messages via TypeScript definitions in boot file
- Add translations to `src/i18n/<locale>/index.ts`
- Reference in templates: `$t('key.path')`

### 4. TypeScript Configuration

- Base config extends `.quasar/tsconfig.json`
- Strict type checking enabled
- Vue shim enabled in `quasar.config.ts`
- Use `type` imports: `import type { Foo } from 'bar'` (enforced by ESLint)

## ESLint & Code Style

- **Flat config** format (eslint.config.js)
- Vue 3 essential rules + TypeScript type-checked
- Enforces `@typescript-eslint/consistent-type-imports`
- Prettier integration (skip formatting)
- Global variables defined for SSR/Electron/BEX modes

## Quasar-Specific Patterns

### Boot Files

Register in `quasar.config.ts` → `boot: ['i18n']` array. Boot files initialize plugins before app mount.

### Vite Plugins

Two key plugins configured:

1. `@intlify/unplugin-vue-i18n/vite` - i18n support with SSR awareness
2. `vite-plugin-checker` - Type checking + ESLint during dev (server: false)

### Auto-Open Dev Server

`devServer.open: true` - Browser launches automatically on `quasar dev`

## Testing Strategy

TDD approach with **composables-only tests** using Vitest:

- **Test environment**: happy-dom (lightweight DOM simulation)
- **Coverage config**: Excludes components, pages, layouts (as per MVP scope)
- **Watch mode**: Default for rapid TDD workflow
- **All composables**: Fully tested (see `tests/composables/*.spec.ts`)

Test files mirror composable structure:

- `useApiKey.spec.ts` - API key storage, validation, localStorage
- `useLanguage.spec.ts` - Language switching and persistence
- `useQuadrantState.spec.ts` - State management and readiness checks
- `usePromptBuilder.spec.ts` - Prompt structure and quadrant logic
- `useOfmanGenerator.spec.ts` - Mocked OpenAI API calls and error handling

See `KNOWLEDGE_BASED.md` section 5 for test specifications.

## MVP Feature Scope

- Single-page app (QuadrantPage.vue)
- 2×2 Ofman quadrant grid
- User inputs ONE trait → AI generates 5 suggestions per remaining quadrant
- LocalStorage for OpenAI API key
- Language switcher (EN/FR)
- Reset functionality

**Not in scope**: User accounts, history, PDF export, animations

## Common Pitfalls to Avoid

1. Don't put logic in components - use composables
2. Don't import with `.vue` extension - Quasar handles it
3. Don't use legacy i18n mode - composition API only
4. Don't forget to register boot files in `quasar.config.ts`
5. Don't use default imports for types - use `import type`

## Key Files to Reference

- `KNOWLEDGE_BASED.md` - Comprehensive MVP specification & architecture
- `quasar.config.ts` - Framework configuration
- `eslint.config.js` - Linting rules
- `src/boot/i18n.ts` - i18n type definitions and setup

## Development Workflow (from KNOWLEDGE_BASED.md)

1. Write composable tests first (TDD)
2. Implement composable logic
3. Build presentational components
4. Wire up with i18n
5. Manual UI validation
