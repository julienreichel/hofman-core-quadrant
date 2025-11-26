/**
 * useOfflineDbGenerator - Generates offline database from core qualities
 *
 * Responsibilities:
 * - Parse comma-separated core quality input
 * - Generate suggestions for all quadrants for each core quality
 * - Build graph structure with traits and links
 * - Deduplicate traits across multiple queries
 * - Export as JSON file
 */

import { ref } from 'vue';
import { useOfmanGenerator } from './useOfmanGenerator';

// Data structure types matching the specification
export interface TraitNode {
  id: string; // lowercase, hyphenated version of primary label
  labels: string[]; // Array of synonyms/variations
  polarity: 'positive' | 'negative';
}

export interface TraitLink {
  from: string; // trait id
  to: string; // trait id
  type: 'excess' | 'balance';
}

export interface OfflineDatabase {
  traits: TraitNode[];
  links: TraitLink[];
}

export function useOfflineDbGenerator() {
  const isGenerating = ref(false);
  const progress = ref(0);
  const currentStatus = ref('');
  const error = ref<string | null>(null);

  const { generateSuggestions } = useOfmanGenerator();

  /**
   * Normalize a word to create a consistent ID
   */
  const normalizeId = (word: string): string => {
    return word
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-'); // Replace spaces with hyphens
  };

  /**
   * Create a link between two traits
   */
  const createLink = (fromId: string, toId: string, type: 'excess' | 'balance'): TraitLink => {
    return { from: fromId, to: toId, type };
  };

  /**
   * Parse comma-separated core qualities
   */
  const parseCoreQualities = (input: string): string[] => {
    return input
      .split(',')
      .map((word) => word.trim())
      .filter((word) => word.length > 0);
  };

  /**
   * Generate all suggestions for one core quality
   * Returns all 4 quadrants worth of suggestions including GPT variations for the core quality
   */
  const generateForCoreQuality = async (
    apiKey: string,
    coreQuality: string,
    language: 'en' | 'fr',
  ): Promise<{
    cores: string[];
    pitfalls: string[];
    challenges: string[];
    allergies: string[];
  }> => {
    // Generate all quadrants including the input (core_quality) to get GPT synonym suggestions
    const suggestions = await generateSuggestions(
      apiKey,
      'core_quality',
      coreQuality,
      language,
      true, // Include input quadrant to get GPT's synonym suggestions
    );

    const cores = suggestions.core_quality || [];
    const pitfalls = suggestions.pitfall || [];
    const challenges = suggestions.challenge || [];
    const allergies = suggestions.allergy || [];

    return {
      cores: cores.filter((c): c is string => c !== undefined),
      pitfalls: pitfalls.filter((p): p is string => p !== undefined),
      challenges: challenges.filter((c): c is string => c !== undefined),
      allergies: allergies.filter((a): a is string => a !== undefined),
    };
  };

  /**
   * Build the complete database from all core qualities
   */
  const buildDatabase = (
    results: Array<{
      cores: string[];
      pitfalls: string[];
      challenges: string[];
      allergies: string[];
    }>,
  ): OfflineDatabase => {
    // Map to accumulate labels for each trait ID
    const traitLabelsMap = new Map<
      string,
      { labels: Set<string>; polarity: 'positive' | 'negative' }
    >();
    const links: TraitLink[] = [];

    // Helper to add or update trait labels using first label as primary ID
    const addTraitLabels = (labels: string[], polarity: 'positive' | 'negative') => {
      if (labels.length === 0) return null;

      // Use the first label to generate the ID
      const primaryLabel = labels[0]!;
      const id = normalizeId(primaryLabel);

      if (!traitLabelsMap.has(id)) {
        // Create new trait with all labels
        traitLabelsMap.set(id, { labels: new Set(labels), polarity });
      } else {
        // Add all labels to existing trait
        labels.forEach((label) => traitLabelsMap.get(id)!.labels.add(label));
      }
      return id;
    };

    // Process each core quality result
    for (const result of results) {
      // Group all core quality suggestions together under first core's ID
      const coreId = addTraitLabels(result.cores, 'positive');
      if (!coreId) continue;

      // Group all pitfalls together under first pitfall's ID
      const pitfallId = addTraitLabels(result.pitfalls, 'negative');
      if (pitfallId) {
        // Core -> Pitfall is "excess"
        links.push(createLink(coreId, pitfallId, 'excess'));
      }

      // Group all challenges together under first challenge's ID
      const challengeId = addTraitLabels(result.challenges, 'positive');
      if (challengeId && pitfallId) {
        // Create link: Pitfall -> Challenge (balance)
        links.push(createLink(pitfallId, challengeId, 'balance'));
      }

      // Group all allergies together under first allergy's ID
      const allergyId = addTraitLabels(result.allergies, 'negative');
      if (allergyId) {
        // Challenge -> Allergy (excess)
        if (challengeId) {
          links.push(createLink(challengeId, allergyId, 'excess'));
        }

        // Allergy -> Core (balance)
        links.push(createLink(allergyId, coreId, 'balance'));
      }
    }

    // Convert accumulated labels to TraitNode array
    const traits: TraitNode[] = Array.from(traitLabelsMap.entries()).map(([id, data]) => ({
      id,
      labels: Array.from(data.labels),
      polarity: data.polarity,
    }));

    return {
      traits,
      links,
    };
  };

  /**
   * Download JSON file
   */
  const downloadJson = (data: OfflineDatabase, filename = 'ofman-database.json') => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Main function to generate offline database
   */
  const generateOfflineDatabase = async (
    apiKey: string,
    coreQualitiesInput: string,
    language: 'en' | 'fr' = 'en',
  ): Promise<void> => {
    isGenerating.value = true;
    progress.value = 0;
    error.value = null;

    try {
      // Parse input
      currentStatus.value = 'Parsing core qualities...';
      const coreQualities = parseCoreQualities(coreQualitiesInput);

      if (coreQualities.length === 0) {
        throw new Error('No core qualities provided');
      }

      // Generate suggestions for each core quality
      const results = [];
      for (let i = 0; i < coreQualities.length; i++) {
        const coreQuality = coreQualities[i];
        if (!coreQuality) continue;

        currentStatus.value = `Generating for: ${coreQuality} (${i + 1}/${coreQualities.length})`;
        const result = await generateForCoreQuality(apiKey, coreQuality, language);
        results.push(result);
        progress.value = ((i + 1) / coreQualities.length) * 80; // 80% for generation
      }

      // Build database
      currentStatus.value = 'Building database structure...';
      const database = buildDatabase(results);
      progress.value = 90;

      // Export
      currentStatus.value = 'Exporting JSON file...';
      downloadJson(database);
      progress.value = 100;
      currentStatus.value = 'Complete!';
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred';
      throw err;
    } finally {
      isGenerating.value = false;
    }
  };

  return {
    isGenerating,
    progress,
    currentStatus,
    error,
    generateOfflineDatabase,
  };
}
