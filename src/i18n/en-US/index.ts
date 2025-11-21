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
  errors: {
    noApiKey: 'Please configure your API key first',
    noInput: 'Please enter a trait in one quadrant',
    generationFailed: 'Failed to generate suggestions',
  },
  offlineDb: {
    buttonLabel: 'Generate Offline DB',
    dialogTitle: 'Generate Offline Database',
    dialogDescription:
      'Enter a list of core qualities (comma-separated) to generate a complete offline database with all relationships.',
    inputLabel: 'Core Qualities',
    inputPlaceholder: 'adaptability, creativity, discipline, empathy...',
    generate: 'Generate',
    cancel: 'Cancel',
    generating: 'Generating...',
    statusParsing: 'Parsing core qualities...',
    statusGenerating: 'Generating for: {trait} ({current}/{total})',
    statusBuilding: 'Building database structure...',
    statusExporting: 'Exporting JSON file...',
    statusComplete: 'Complete! Download started.',
    errorNoQualities: 'Please enter at least one core quality',
    errorGeneration: 'Generation failed: {error}',
    // Import database keys
    importButton: 'Import Database',
    importTitle: 'Import Custom Database',
    importDescription:
      'Upload a JSON file with custom traits and relationships. If no database is imported, the default database will be used.',
    selectFile: 'Select JSON file',
    import: 'Import',
    importSuccess: 'Database imported successfully',
    importError: 'Failed to import database',
    customDbLoaded: 'Custom database loaded ({count} traits)',
    defaultDbLoaded: 'Using default database ({count} traits)',
  },
};
