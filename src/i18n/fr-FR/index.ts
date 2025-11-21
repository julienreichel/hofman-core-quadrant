export default {
  app: {
    title: 'Générateur de Quadrant de Ofman',
  },
  header: {
    apiKeyPresent: 'Clé API Configurée',
    apiKeyMissing: 'Pas de Clé API',
    configureApiKey: 'Configurer la Clé API',
  },
  apiKeyDialog: {
    title: 'Clé API OpenAI',
    description: 'Entrez votre clé API OpenAI pour générer des suggestions de quadrant.',
    placeholder: 'sk-...',
    save: 'Enregistrer',
    cancel: 'Annuler',
    invalidKey: 'Format de clé API invalide',
  },
  quadrant: {
    core_quality: {
      label: 'Qualité Fondamentale',
      description: 'Votre force ou trait positif',
      placeholder: 'Entrez une qualité fondamentale...',
    },
    pitfall: {
      label: 'Piège',
      description: "Qualité fondamentale poussée à l'extrême",
      placeholder: 'Entrez un piège...',
    },
    challenge: {
      label: 'Défi',
      description: "La force d'équilibre dont vous avez besoin",
      placeholder: 'Entrez un défi...',
    },
    allergy: {
      label: 'Allergie',
      description: 'Ce que vous trouvez le plus difficile',
      placeholder: 'Entrez une allergie...',
    },
    selected: 'Sélectionné :',
    suggestions: 'Suggestions :',
  },
  actions: {
    generate: 'Générer des Suggestions',
    reset: 'Réinitialiser',
    generating: 'Génération en cours...',
    selectSuggestion: 'Cliquez pour sélectionner',
  },
  errors: {
    noApiKey: "Veuillez d'abord configurer votre clé API",
    noInput: 'Veuillez entrer un trait dans un quadrant',
    generationFailed: 'Échec de la génération des suggestions',
  },
};
