# Manual Testing Checklist for Ofman Quadrant Generator

## ✅ MASTER PROMPT 7 - Acceptance Criteria

### Flow 1: Set API Key

- [ ] Click on "No API Key" button in header
- [ ] Dialog opens with title "OpenAI API Key"
- [ ] Enter invalid key (no sk- prefix) → Shows error after save
- [ ] Enter valid key format (sk-xxx...) → Saves successfully
- [ ] Header shows "API Key Configured" with green check icon
- [ ] Dialog closes automatically

### Flow 2: Enter Trait

- [ ] Type a trait in Core Quality quadrant
- [ ] Input field becomes active
- [ ] Can type freely in the field
- [ ] Other quadrants remain empty
- [ ] Can switch to different quadrant and type there instead

### Flow 3: Generate Suggestions

- [ ] Generate button is disabled when no API key
- [ ] Generate button is disabled when no input
- [ ] Generate button is enabled when both are present
- [ ] Click Generate → Shows loading state
- [ ] After generation:
  - [ ] 5 suggestions appear in each of the other 3 quadrants
  - [ ] Success notification appears
  - [ ] Suggestions are clickable chips
  - [ ] Input quadrant shows no suggestions (only user input)

### Flow 4: Select Suggestions

- [ ] Click on any suggestion chip
- [ ] Chip becomes highlighted (filled, primary color)
- [ ] Selection persists visually
- [ ] Can change selection by clicking different chip
- [ ] Can select one suggestion from each quadrant
- [ ] Summary view appears when all 4 quadrants have values

### Flow 5: Reset

- [ ] Click Reset button
- [ ] All inputs clear
- [ ] All suggestions clear
- [ ] All selections clear
- [ ] Summary view disappears
- [ ] Info notification appears
- [ ] Can start over from Flow 2

### Additional Checks

#### Language Switching (i18n)

- [ ] Click language dropdown in header
- [ ] Shows EN and FR options
- [ ] Switch to FR → All UI text translates (if French translations added)
- [ ] Switch back to EN → Returns to English
- [ ] Language preference persists in localStorage

#### Responsive Design

- [ ] On desktop: 2×2 grid layout
- [ ] On mobile: Stacks into single column
- [ ] All components remain readable and usable
- [ ] Buttons remain accessible

#### Error Handling

- [ ] Try to generate without API key → Shows error message
- [ ] Try to generate without input → Shows error message
- [ ] Invalid API call → Shows error notification
- [ ] Errors are displayed in red banner
- [ ] Errors clear when user takes corrective action

#### No Console Errors

- [ ] Open browser console (F12)
- [ ] Perform all flows above
- [ ] No errors or warnings in console
- [ ] No TypeScript errors at runtime

#### LocalStorage Persistence

- [ ] Set API key and close browser
- [ ] Reopen → API key is still configured
- [ ] Switch language and refresh page
- [ ] Language selection persists

### Component Integration

#### HeaderBar

- [x] Displays app title from i18n
- [x] Shows language selector
- [x] Shows API key status indicator
- [x] Opens API dialog on click

#### ApiKeyDialog

- [x] Integrates useApiKey composable
- [x] Masked password input
- [x] Save/Cancel functionality
- [x] Validation feedback

#### QuadrantBox (×4)

- [x] All 4 quadrants rendered
- [x] Labels and descriptions from i18n
- [x] Input fields work
- [x] Suggestions display
- [x] Selection highlights

#### GeneratePanel

- [x] Generate button with proper states
- [x] Reset button
- [x] Loading spinner
- [x] Error display

#### SummaryView

- [x] Shows when all quadrants filled
- [x] Displays all selected words
- [x] Uses i18n for labels

### Composables Integration

- [x] useApiKey: API key management
- [x] useLanguage: Language switching
- [x] useQuadrantState: State management
- [x] useOfmanGenerator: OpenAI API calls
- [x] usePromptBuilder: Prompt construction

### Final Validation

- [ ] Full workflow works end-to-end
- [ ] No business logic in components
- [ ] All UI text from i18n
- [ ] Simple, clear UX
- [ ] Responsive layout
- [ ] Error handling works
- [ ] Minimal but functional MVP

## Notes

To test: `quasar dev` (browser opens automatically)

API Key Format: Must start with `sk-` and be >20 characters
Example test key: `sk-test123456789012345678901234567890`

For actual testing with OpenAI:

- Use your real OpenAI API key
- Try different traits: "Decisive", "Empathetic", "Analytical", etc.
- Verify AI-generated suggestions make sense according to Ofman model
