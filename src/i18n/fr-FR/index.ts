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
    noMatches: 'Aucun trait correspondant trouvé',
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
  offlineDb: {
    buttonLabel: 'Générer une BDD Hors Ligne',
    dialogTitle: 'Générer une Base de Données Hors Ligne',
    dialogDescription:
      'Entrez une liste de qualités fondamentales (séparées par des virgules) pour générer une base de données hors ligne complète avec toutes les relations.',
    inputLabel: 'Qualités Fondamentales',
    inputPlaceholder: 'adaptabilité, créativité, discipline, empathie...',
    generate: 'Générer',
    cancel: 'Annuler',
    generating: 'Génération en cours...',
    statusParsing: 'Analyse des qualités fondamentales...',
    statusGenerating: 'Génération pour : {trait} ({current}/{total})',
    statusBuilding: 'Construction de la structure de la base de données...',
    statusExporting: 'Exportation du fichier JSON...',
    statusComplete: 'Terminé ! Téléchargement lancé.',
    errorNoQualities: 'Veuillez entrer au moins une qualité fondamentale',
    errorGeneration: 'Échec de la génération : {error}',
    // Import database keys
    importButton: 'Importer une Base de Données',
    importTitle: 'Importer une Base de Données Personnalisée',
    importDescription:
      "Téléchargez un fichier JSON avec des traits et des relations personnalisés. Si aucune base de données n'est importée, la base de données par défaut sera utilisée.",
    selectFile: 'Sélectionner un fichier JSON',
    import: 'Importer',
    importSuccess: 'Base de données importée avec succès',
    importError: "Échec de l'importation de la base de données",
    customDbLoaded: 'Base de données personnalisée chargée ({count} traits)',
    defaultDbLoaded: 'Utilisation de la base de données par défaut ({count} traits)',
  },
};
