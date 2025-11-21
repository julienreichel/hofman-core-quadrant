import { describe, it, expect } from 'vitest';
import { usePromptBuilder } from 'src/composables/usePromptBuilder';

describe('usePromptBuilder', () => {
  const { buildPrompt } = usePromptBuilder();

  describe('buildPrompt', () => {
    it('should build a prompt with core_quality input', () => {
      const prompt = buildPrompt('core_quality', 'Decisive');

      expect(prompt).toContain('Decisive');
      expect(prompt).toContain('core quality');
      expect(prompt).toContain('Ofman Core Quadrant');
      expect(prompt).toContain('JSON');
    });

    it('should build a prompt with pitfall input', () => {
      const prompt = buildPrompt('pitfall', 'Domineering');

      expect(prompt).toContain('Domineering');
      expect(prompt).toContain('pitfall');
      expect(prompt).toContain('Ofman Core Quadrant');
    });

    it('should build a prompt with challenge input', () => {
      const prompt = buildPrompt('challenge', 'Flexible');

      expect(prompt).toContain('Flexible');
      expect(prompt).toContain('challenge');
      expect(prompt).toContain('Ofman Core Quadrant');
    });

    it('should build a prompt with allergy input', () => {
      const prompt = buildPrompt('allergy', 'Indecisive');

      expect(prompt).toContain('Indecisive');
      expect(prompt).toContain('allergy');
      expect(prompt).toContain('Ofman Core Quadrant');
    });

    it('should request JSON structure in response', () => {
      const prompt = buildPrompt('core_quality', 'Decisive');

      expect(prompt).toContain('JSON');
      expect(prompt).toContain('"core_quality"');
      expect(prompt).toContain('"pitfall"');
      expect(prompt).toContain('"challenge"');
      expect(prompt).toContain('"allergy"');
    });

    it('should explain the Ofman quadrant relationships', () => {
      const prompt = buildPrompt('core_quality', 'Decisive');

      expect(prompt).toContain('Core Quality');
      expect(prompt).toContain('Pitfall');
      expect(prompt).toContain('Challenge');
      expect(prompt).toContain('Allergy');
      expect(prompt).toContain('relationships');
    });

    it('should instruct to exclude the input quadrant', () => {
      const prompt = buildPrompt('core_quality', 'Decisive');

      expect(prompt).toContain('Do NOT include suggestions for "core_quality"');
    });

    it('should request 5 suggestions per quadrant', () => {
      const prompt = buildPrompt('core_quality', 'Decisive');

      expect(prompt).toContain('5 distinct suggestions');
      expect(prompt).toMatch(/suggestion5/);
    });

    it('should request short phrases (2-4 words)', () => {
      const prompt = buildPrompt('pitfall', 'Domineering');

      expect(prompt).toContain('2-4 words');
    });

    it('should produce different prompts for different input values', () => {
      const prompt1 = buildPrompt('core_quality', 'Decisive');
      const prompt2 = buildPrompt('core_quality', 'Empathetic');

      expect(prompt1).toContain('Decisive');
      expect(prompt2).toContain('Empathetic');
      expect(prompt1).not.toContain('Empathetic');
      expect(prompt2).not.toContain('Decisive');
    });

    it('should produce different prompts for different quadrants', () => {
      const prompt1 = buildPrompt('core_quality', 'Decisive');
      const prompt2 = buildPrompt('pitfall', 'Decisive');

      expect(prompt1).toContain('core_quality');
      expect(prompt2).toContain('pitfall');
      expect(prompt1).toContain('Do NOT include suggestions for "core_quality"');
      expect(prompt2).toContain('Do NOT include suggestions for "pitfall"');
    });

    it('should default to English when no language specified', () => {
      const prompt = buildPrompt('core_quality', 'Decisive');

      expect(prompt).toContain('MUST be in English');
    });

    it('should request English suggestions when language is "en"', () => {
      const prompt = buildPrompt('core_quality', 'Decisive', 'en');

      expect(prompt).toContain('MUST be in English');
      expect(prompt).not.toContain('MUST be in French');
    });

    it('should request French suggestions when language is "fr"', () => {
      const prompt = buildPrompt('core_quality', 'Décisif', 'fr');

      expect(prompt).toContain('MUST be in French');
      expect(prompt).not.toContain('MUST be in English');
    });
  });
});
