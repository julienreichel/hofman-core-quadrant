# 🧭 **Ofman Quadrant Generator — MVP Knowledge Base**

## **Tech stack:** Quasar + Vue 3 + JavaScript + I18n + OpenAI (GPT-4o-mini)

---

# 🎯 **1. Project Aim**

The purpose of this MVP is to create a **fully client-side Ofman Quadrant Generator**, allowing users to:

1. Enter one trait (positive or negative) in **any quadrant** of the Ofman model.
2. Automatically generate **complementary quadrants** using **OpenAI GPT-4o-mini**.
3. Select **one preferred term** for each quadrant among 5 suggestions.
4. Reset and start again.
5. Use their **own OpenAI API key**, stored locally in the browser.
6. View all UI text in **English or French** with simple language switching.

This MVP is meant to be:

- Simple
- Fast to build
- Pure front-end (no backend)
- Easy to extend in future iterations

This document serves as the **single source of truth** during development.

---

# 🧩 **2. MVP Functional Scope**

Only **one screen** is needed: the Quadrant Editor.
All functionality is performed in-browser.

---

## **2.1 User Stories**

### **US1 — View the Ofman Quadrant**

Users can see the 4 quadrants laid out in a simple 2×2 grid.

### **US2 — Enter a Trait**

Users can input text into **any** quadrant.
Only one quadrant is used as the “input source” for the generation.

### **US3 — Enter API Key**

Users provide an OpenAI API key, stored in localStorage with a visible indicator when present.

### **US4 — Generate Suggestions via OpenAI**

After entering one trait, users can press **Generate**, triggering GPT-4o-mini to:

- Identify the entered quadrant
- Produce **5 suggestions** for each of the remaining 3 quadrants
- Return structured suggestions

### **US5 — Select Final Words**

Users can click on any suggestion to choose one final term per quadrant.

### **US6 — Reset**

Users can wipe all data (except the API key) and start again.

### **US7 — Language Switching (i18n)**

UI is available in **English and French**, selectable from the header.

---

# 🛠️ **3. Architecture**

This section describes how the application is structured for clarity and rapid implementation.

---

## **3.1 Directory Structure**

```
src/
  components/
  composables/
  pages/
  router/
  i18n/
  App.vue
  main.js

tests/
  composables/
```

---

## **3.2 Composables (Logic Layer)**

_Composables contain all testable logic. No UI here._

### **`useApiKey.js`**

- Stores and retrieves the API key
- Validates basic format
- Indicates whether key is present

### **`useLanguage.js`**

- Manages selected language (en/fr)
- Persists to localStorage

### **`useQuadrantState.js`**

- Reactive state for:
  - user input quadrant
  - AI suggestions
  - final selected words

- Provides a `reset()` function

### **`usePromptBuilder.js`**

- Builds an English-language GPT prompt following the Ofman quadrant methodology

### **`useOfmanGenerator.js`**

- Calls OpenAI GPT-4o-mini
- Handles loading/error states
- Parses suggestions into:

  ```js
  { pitfall: [...], challenge: [...], allergy: [...] }
  ```

---

## **3.3 Components (UI Layer)**

_No logic — only input/output, presentation, and events._

### **`HeaderBar.vue`**

- Title
- Language selector
- API key dialog trigger
- API key presence indicator

### **`ApiKeyDialog.vue`**

- Password field
- Save/reject button
- Writes to `useApiKey`

### **`QuadrantBox.vue`**

- Label & description (i18n)
- Input field (only for the chosen quadrant)
- Suggestion chips
- Selected word display

### **`SuggestionList.vue`**

- Renders 5 clickable suggestion chips

### **`GeneratePanel.vue`**

- Generate button
- Reset button
- Loading spinner
- Error messages

### **`SummaryView.vue`** _(Optional)_

- Displays the final chosen 4-quadrant set

---

## **3.4 Pages**

### **`pages/QuadrantPage.vue`**

The main (and only) screen.
Contains:

- HeaderBar
- 2×2 grid of QuadrantBoxes
- GeneratePanel
- ApiKeyDialog

---

## **3.5 Router**

Only one route:

```
/ → QuadrantPage.vue
```

---

# 🌍 **4. i18n Specification**

## **4.1 Language Files**

```
src/i18n/en.json
src/i18n/fr.json
```

### Required Translation Keys:

- App title
- Button labels
- Quadrant labels
- Quadrant descriptions
- Error messages
- Dialog titles
- API key indicator string

All UI text **must** use:

```js
$t('key.path');
```

---

# 🧪 **5. Testing Strategy (TDD)**

We use a **composables-only testing strategy** due to the 8h constraint.
Framework: **Vitest**

---

## **5.1 What We Test**

### **`useApiKey.spec.js`**

- save key
- load key
- validate key
- localStorage interactions

### **`useLanguage.spec.js`**

- default language
- switching
- persistence

### **`useQuadrantState.spec.js`**

- set input
- set suggestion
- reset
- readiness for generation

### **`usePromptBuilder.spec.js`**

- correct prompt structure
- correct quadrant logic

### **`useOfmanGenerator.spec.js`**

(Mocked GPT API)

- correct call format
- mapping of responses
- error handling

---

## **5.2 What We Do NOT Test**

- Vue components
- UI rendering
- Translations
- Layout / CSS

---

# 🧭 **6. Development Roadmap (8h TDD)**

### **Hour 1–2**

Test & implement:

- useApiKey
- useLanguage

### **Hour 2–4**

Test & implement:

- useQuadrantState
- usePromptBuilder
- useOfmanGenerator

### **Hour 4–8**

Implement UI components:

- HeaderBar
- ApiKeyDialog
- QuadrantBox
- SuggestionList
- GeneratePanel
- QuadrantPage

Add:

- i18n integration
- Manual end-to-end UI validation

---

# 🔮 **7. Future Extensions (Not in MVP)**

- Saving history of quadrants
- User accounts
- Export as PDF/image
- Advanced i18n (translate generated words)
- Component-level tests
- Animations or guided onboarding
- Suggestions caching
- Thematic color coding per quadrant

---

# 📌 **8. Summary**

This MVP delivers a **complete Ofman Quadrant Generator**, entirely client-side, with:

- clean testable logic
- minimal UI
- AI generation flow
- i18n support
- local storage API key
- single-page simplicity

This document should remain the **central development reference** for the entire MVP.
