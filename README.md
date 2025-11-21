# Ofman Core Quadrant Generator

An AI-powered web application for generating personalized [Ofman Core Quadrant](https://en.wikipedia.org/wiki/Core_quadrants) insights for personal development and understanding behavior patterns.

## 🎯 Features

- **AI-Powered Generation**: Uses OpenAI GPT-4o-mini to suggest traits based on your input
- **Interactive Interface**: Select from 5 AI-generated suggestions for each quadrant
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

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- OpenAI API key (get one at [platform.openai.com](https://platform.openai.com))

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

## 🛠️ Tech Stack

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

- **66 passing tests** covering all composables
- **No component tests** in MVP (focus on business logic)
- **Mocked OpenAI calls** for fast, deterministic tests
- **100% composable coverage**

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
