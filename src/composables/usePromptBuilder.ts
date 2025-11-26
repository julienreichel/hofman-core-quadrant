/**
 * usePromptBuilder - Builds GPT prompts for Ofman quadrant generation
 *
 * Responsibilities:
 * - Build prompts following the Ofman quadrant methodology
 * - Handle different input quadrants correctly
 * - Request structured JSON responses
 */

import type { QuadrantType } from './useQuadrantState';

export function usePromptBuilder() {
  /**
   * Build a prompt for OpenAI to generate Ofman quadrant suggestions
   * @param inputQuadrant - Which quadrant the user provided
   * @param inputValue - The trait/word the user entered
   * @param language - The language for suggestions ('en' or 'fr')
   * @returns Formatted prompt string
   */
  const buildPrompt = (
    inputQuadrant: QuadrantType,
    inputValue: string,
    language: 'en' | 'fr' = 'en',
  ): string => {
    const quadrantDescriptions = {
      core_quality:
        'Core Quality: A positive trait or strength that defines someone at their best.',
      pitfall: 'Pitfall: What happens when the core quality is overused or taken to an extreme.',
      challenge:
        "Challenge: The opposite positive trait that balances the core quality (the person's growth edge).",
      allergy:
        'Allergy: What the person finds most difficult or irritating (opposite of core quality, negative form).',
    };

    const quadrantRelationships = `
The Ofman Core Quadrant model shows these relationships:
- Core Quality (top-left): Your strength
- Pitfall (top-right): Too much of your strength
- Challenge (bottom-left): The balancing strength you need
- Allergy (bottom-right): What you can't stand (often because you lack it)

Relationships:
- Pitfall = Core Quality taken too far
- Challenge = Opposite positive of Core Quality
- Allergy = Challenge taken too far (or Core Quality's negative opposite)
`;

    const languageInstruction =
      language === 'fr'
        ? '\n**CRITICAL REQUIREMENT: You MUST respond in French. All suggestions MUST be French words or French phrases. This is mandatory.**\n'
        : '\n**CRITICAL REQUIREMENT: You MUST respond in English. All suggestions MUST be English words or English phrases. This is mandatory.**\n';

    const languageReminder =
      language === 'fr'
        ? '\n\nREMINDER: Return all suggestions in French only. No English words allowed.'
        : '\n\nREMINDER: Return all suggestions in English only.';

    const prompt = `You are an expert in the Ofman Core Quadrant model, a framework for personal development and understanding behavior patterns.

${quadrantRelationships}
${languageInstruction}
The user has provided this ${inputQuadrant.replace('_', ' ')}: "${inputValue}"

${quadrantDescriptions[inputQuadrant]}

Based on this input, generate 5 distinct suggestions for each of the OTHER three quadrants. Each suggestion should be a single word or short phrase (2-4 words maximum).
${languageReminder}

Return your response as a JSON object with this exact structure:
{
  "core_quality": ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"],
  "pitfall": ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"],
  "challenge": ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"],
  "allergy": ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"]
}

Only return valid JSON, no additional text.`;

    return prompt;
  };

  return {
    buildPrompt,
  };
}
