export default {
  app: {
    title: 'Ofman Core Quadrant Generator',
  },
  header: {
    apiKeyPresent: 'API Key Configured',
    apiKeyMissing: 'No API Key',
    configureApiKey: 'Configure API Key',
  },
  apiKeyDialog: {
    title: 'OpenAI API Key',
    description: 'Enter your OpenAI API key to generate quadrant suggestions.',
    placeholder: 'sk-...',
    save: 'Save',
    cancel: 'Cancel',
    invalidKey: 'Invalid API key format',
  },
  quadrant: {
    core_quality: {
      label: 'Core Quality',
      description: 'Your strength or positive trait',
      placeholder: 'Enter a core quality...',
    },
    pitfall: {
      label: 'Pitfall',
      description: 'Core quality taken too far',
      placeholder: 'Enter a pitfall...',
    },
    challenge: {
      label: 'Challenge',
      description: 'The balancing strength you need',
      placeholder: 'Enter a challenge...',
    },
    allergy: {
      label: 'Allergy',
      description: 'What you find most difficult',
      placeholder: 'Enter an allergy...',
    },
    selected: 'Selected:',
    suggestions: 'Suggestions:',
  },
  actions: {
    generate: 'Generate Suggestions',
    reset: 'Reset',
    generating: 'Generating...',
    selectSuggestion: 'Click to select',
  },
  summary: {
    title: 'Your Complete Ofman Quadrant',
  },
  errors: {
    noApiKey: 'Please configure your API key first',
    noInput: 'Please enter a trait in one quadrant',
    generationFailed: 'Failed to generate suggestions',
  },
};
