import { ref, computed } from 'vue';
import type { MessageLanguages } from 'src/boot/i18n';

export interface TraitNode {
  id: string;
  label: string;
  polarity: 'positive' | 'negative';
}

export interface TraitLink {
  from: string;
  to: string;
  type: 'excess' | 'balance';
}

export interface OfflineDatabase {
  traits: TraitNode[];
  links: TraitLink[];
}

// Module-level state shared across all instances
const currentDatabase = ref<OfflineDatabase | null>(null);
const isCustomDatabase = ref(false);

/**
 * Composable for managing offline database (default or custom imported)
 * Provides trait suggestions and link traversal for offline mode
 */
export function useOfflineDatabase() {
  /**
   * Load the default database for the given language
   */
  async function loadDefaultDatabase(language: MessageLanguages): Promise<void> {
    const fileName = language === 'fr-FR' ? 'database.fr.json' : 'database.en.json';
    try {
      const response = await fetch(`/src/assets/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to load database: ${response.statusText}`);
      }
      const db = await response.json();
      currentDatabase.value = db as OfflineDatabase;
      isCustomDatabase.value = false;
    } catch (error) {
      console.error('Failed to load default database:', error);
      throw error;
    }
  }

  /**
   * Import a custom database from JSON file
   */
  function importDatabase(jsonContent: string): void {
    try {
      const parsed = JSON.parse(jsonContent);

      // Validate structure
      if (!parsed.traits || !Array.isArray(parsed.traits)) {
        throw new Error('Invalid database: missing traits array');
      }
      if (!parsed.links || !Array.isArray(parsed.links)) {
        throw new Error('Invalid database: missing links array');
      }

      // Validate trait structure
      for (const trait of parsed.traits) {
        if (!trait.id || !trait.label || !trait.polarity) {
          throw new Error('Invalid trait structure');
        }
        if (trait.polarity !== 'positive' && trait.polarity !== 'negative') {
          throw new Error('Invalid polarity value');
        }
      }

      // Validate link structure
      for (const link of parsed.links) {
        if (!link.from || !link.to || !link.type) {
          throw new Error('Invalid link structure');
        }
        if (link.type !== 'excess' && link.type !== 'balance') {
          throw new Error('Invalid link type');
        }
      }

      currentDatabase.value = parsed as OfflineDatabase;
      isCustomDatabase.value = true;
    } catch (error) {
      throw new Error(
        `Failed to import database: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Get all traits with the specified polarity
   */
  function getTraitsByPolarity(polarity: 'positive' | 'negative'): TraitNode[] {
    if (!currentDatabase.value) return [];
    return currentDatabase.value.traits.filter((t) => t.polarity === polarity);
  }

  /**
   * Get a trait by its ID
   */
  function getTraitById(id: string): TraitNode | undefined {
    if (!currentDatabase.value) return undefined;
    return currentDatabase.value.traits.find((t) => t.id === id);
  }

  /**
   * Search traits by label (case-insensitive partial match)
   */
  function searchTraits(query: string, polarity?: 'positive' | 'negative'): TraitNode[] {
    if (!currentDatabase.value || !query) return [];

    const lowerQuery = query.toLowerCase();
    let results = currentDatabase.value.traits.filter((t) =>
      t.label.toLowerCase().includes(lowerQuery),
    );

    if (polarity) {
      results = results.filter((t) => t.polarity === polarity);
    }

    return results;
  }

  /**
   * Get linked traits from a source trait
   * @param fromId - Source trait ID
   * @param linkType - Type of link to follow ('excess' or 'balance')
   * @param maxResults - Maximum number of results (if more exist, pick randomly)
   */
  function getLinkedTraits(
    fromId: string,
    linkType: 'excess' | 'balance',
    maxResults = 5,
  ): TraitNode[] {
    if (!currentDatabase.value) return [];

    // Find all links from the source trait with the specified type
    const links = currentDatabase.value.links.filter(
      (link) => link.from === fromId && link.type === linkType,
    );

    // Get the target trait nodes
    const targetTraits = links
      .map((link) => getTraitById(link.to))
      .filter((trait): trait is TraitNode => trait !== undefined);

    // If we have more results than maxResults, pick randomly
    if (targetTraits.length <= maxResults) {
      return targetTraits;
    }

    // Shuffle and pick random subset
    const shuffled = [...targetTraits].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, maxResults);
  }

  /**
   * Get traits that link TO this trait (reverse lookup)
   * @param toId - Target trait ID
   * @param linkType - Type of link to follow ('excess' or 'balance')
   * @param maxResults - Maximum number of results (if more exist, pick randomly)
   */
  function getReverseLinkedTraits(
    toId: string,
    linkType: 'excess' | 'balance',
    maxResults = 5,
  ): TraitNode[] {
    if (!currentDatabase.value) return [];

    // Find all links TO the target trait with the specified type
    const links = currentDatabase.value.links.filter(
      (link) => link.to === toId && link.type === linkType,
    );

    // Get the source trait nodes
    const sourceTraits = links
      .map((link) => getTraitById(link.from))
      .filter((trait): trait is TraitNode => trait !== undefined);

    // If we have more results than maxResults, pick randomly
    if (sourceTraits.length <= maxResults) {
      return sourceTraits;
    }

    // Shuffle and pick random subset
    const shuffled = [...sourceTraits].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, maxResults);
  }

  /**
   * Check if database is loaded
   */
  const isDatabaseLoaded = computed(() => currentDatabase.value !== null);

  /**
   * Get total number of traits in current database
   */
  const traitCount = computed(() => currentDatabase.value?.traits.length ?? 0);

  return {
    // State
    currentDatabase: computed(() => currentDatabase.value),
    isDatabaseLoaded,
    isCustomDatabase: computed(() => isCustomDatabase.value),
    traitCount,

    // Methods
    loadDefaultDatabase,
    importDatabase,
    getTraitsByPolarity,
    getTraitById,
    searchTraits,
    getLinkedTraits,
    getReverseLinkedTraits,
  };
}
