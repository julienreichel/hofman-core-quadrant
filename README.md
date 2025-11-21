# Ofman Core Quadrant Generator

[![CI/CD Pipeline](https://github.com/julienreichel/hofman-core-quadrant/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/julienreichel/hofman-core-quadrant/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An AI-powered web application for generating personalized [Ofman Core Quadrant](https://en.wikipedia.org/wiki/Core_quadrants) insights for personal development and understanding behavior patterns.

**🌐 Live Demo**: [https://julienreichel.github.io/hofman-core-quadrant/](https://julienreichel.github.io/hofman-core-quadrant/)

## 🎯 Features

- **AI-Powered Generation**: Uses OpenAI GPT-4o-mini to suggest traits based on your input
- **Offline Mode**: Works without an API key using a preset database of traits (degraded mode)
- **Interactive Interface**: Select from 5 AI-generated suggestions for each quadrant
- **Searchable Dropdown**: Autocomplete trait selection in offline mode
- **Bilingual Support**: Full English and French translations (EN/FR)
- **Client-Side Only**: All data stays in your browser (localStorage for API key)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clean UX**: Minimal, focused interface with real-time feedback

## 🧠 What is the Ofman Core Quadrant?

The Ofman Core Quadrant is a personal development framework that maps behavioral patterns through four interconnected concepts:

- **Core Quality** (top-left): Your strength or positive trait
- **Pitfall** (top-right): Your core quality taken too far
- **Challenge** (bottom-right): The balancing strength you need
- **Allergy** (bottom-left): What you find most difficult (often the opposite of your core quality)

This tool helps you explore these relationships by:

1. Enter one trait in any quadrant
2. AI generates 5 suggestions for the other three quadrants
3. Select the words that resonate most with you
4. Explore your complete behavioral pattern

## 🔑 Usage Modes

### Online Mode (with API Key)

- Provide your OpenAI API key for full AI-powered suggestions
- Get personalized trait suggestions based on any input
- More flexible and contextual responses

### Offline Mode (without API Key)

- Use the built-in database of preset traits (degraded mode)
- Search and select from a curated list of traits via autocomplete dropdown
- Navigate trait relationships using pre-generated connections
- Perfect for quick exploration or when you don't have an API key

**Note**: In offline mode, you can only select from traits that exist in the preset database. Use the searchable dropdown to find available options.

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- OpenAI API key (optional - get one at [platform.openai.com](https://platform.openai.com) for full AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/julienreichel/hofman-core-quadrant.git
cd hofman-core-quadrant

# Install dependencies
npm install
```

### Development

```bash
# Start the development server with hot-reload
npm run dev
# or
quasar dev

# The app will open automatically at http://localhost:9000
```

### Build for Production

```bash
# Build optimized static files
npm run build
# or
quasar build

# Output will be in dist/spa/
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Linting & Formatting

```bash
# Lint code
npm run lint

# Format code with Prettier
npm run format
```

## � Deployment

The application is automatically deployed to GitHub Pages via GitHub Actions on every push to the `main` branch.

### CI/CD Pipeline

The workflow includes:

1. **Quality Gate**
   - Run ESLint checks
   - Execute all unit tests (99 tests)
   - Generate coverage report

2. **Build**
   - Build optimized production bundle
   - Generate static files for deployment

3. **Deploy**
   - Automatically deploy to GitHub Pages
   - Available at: https://julienreichel.github.io/hofman-core-quadrant/

### Manual Deployment

To deploy manually to GitHub Pages:

```bash
# Build with GitHub Pages configuration
GITHUB_PAGES=true npm run build

# The dist/spa/ folder is ready for deployment
```

## �🛠️ Tech Stack

- **Framework**: [Quasar v2](https://quasar.dev) (Vue 3 + Vite)
- **Language**: TypeScript (strict mode)
- **State Management**: Composables-based (no Vuex/Pinia)
- **i18n**: vue-i18n with composition API
- **Testing**: Vitest + happy-dom
- **AI**: OpenAI GPT-4o-mini API
- **Styling**: SCSS + Quasar components

## 📁 Project Structure

```
src/
├── boot/            # Quasar boot files (i18n setup)
├── components/      # Vue components
│   ├── ApiKeyDialog.vue
│   ├── GeneratePanel.vue
│   ├── HeaderBar.vue
│   ├── QuadrantBox.vue
│   └── SuggestionList.vue
├── composables/     # Business logic (testable)
│   ├── useApiKey.ts
│   ├── useLanguage.ts
│   ├── useOfmanGenerator.ts
│   ├── useOfflineDatabase.ts
│   ├── useOfflineDbGenerator.ts
│   ├── usePromptBuilder.ts
│   └── useQuadrantState.ts
├── i18n/            # Translation files
│   ├── en-US/
│   └── fr-FR/
├── layouts/         # Layout components
├── pages/           # Page components
└── router/          # Vue Router config

tests/
└── composables/     # Vitest unit tests
```

## 🔒 Privacy & Security

- **No Server**: 100% client-side application
- **No Data Collection**: No analytics, tracking, or data sent to our servers
- **API Key Storage**: Your OpenAI API key is stored only in your browser's localStorage
- **No History**: Sessions are not saved (clear your quadrant with Reset button)

## 🌍 Internationalization

The app supports:

- **English** (en-US) - Default
- **French** (fr-FR)

To add a new language:

1. Create `src/i18n/<locale>/index.ts`
2. Add translations following the English structure
3. Update `src/i18n/index.ts` to export the new locale
4. Add the language code to `src/composables/useLanguage.ts`

## 🧪 Testing Philosophy

This project follows TDD principles with comprehensive unit testing:

- **99 passing tests** covering all composables
- **No component tests** in MVP (focus on business logic)
- **Mocked OpenAI calls** for fast, deterministic tests
- **100% composable coverage** including offline database functionality

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Daniel Ofman](https://en.wikipedia.org/wiki/Core_quadrants) - Creator of the Core Quadrant model
- [Quasar Framework](https://quasar.dev) - Amazing Vue framework
- [OpenAI](https://openai.com) - GPT-4o-mini API

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Julien Reichel - [@julienreichel](https://github.com/julienreichel)

Project Link: [https://github.com/julienreichel/hofman-core-quadrant](https://github.com/julienreichel/hofman-core-quadrant)

---

Made with ❤️ using [Quasar Framework](https://quasar.dev)
