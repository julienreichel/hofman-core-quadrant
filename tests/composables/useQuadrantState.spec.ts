import { describe, it, expect } from 'vitest';
import { useQuadrantState } from 'src/composables/useQuadrantState';

describe('useQuadrantState', () => {
  describe('initialization', () => {
    it('should initialize with null input quadrant', () => {
      const { inputQuadrant } = useQuadrantState();
      expect(inputQuadrant.value).toBeNull();
    });

    it('should initialize with empty input value', () => {
      const { inputValue } = useQuadrantState();
      expect(inputValue.value).toBe('');
    });

    it('should initialize with empty suggestions', () => {
      const { suggestions } = useQuadrantState();
      expect(suggestions.value).toEqual({
        core_quality: [],
        pitfall: [],
        challenge: [],
        allergy: [],
      });
    });

    it('should initialize with empty selected words', () => {
      const { selectedWords } = useQuadrantState();
      expect(selectedWords.value).toEqual({
        core_quality: '',
        pitfall: '',
        challenge: '',
        allergy: '',
      });
    });
  });

  describe('setInput', () => {
    it('should set input quadrant and value', () => {
      const { inputQuadrant, inputValue, setInput } = useQuadrantState();
      setInput('core_quality', 'Decisive');

      expect(inputQuadrant.value).toBe('core_quality');
      expect(inputValue.value).toBe('Decisive');
    });

    it('should not set selected word for input quadrant', () => {
      const { selectedWords, setInput } = useQuadrantState();
      setInput('pitfall', 'Domineering');

      // setInput should only update inputQuadrant and inputValue,
      // not the selectedWords. Selection happens explicitly via selectWord()
      expect(selectedWords.value.pitfall).toBe('');
    });

    it('should update input when called multiple times', () => {
      const { inputQuadrant, inputValue, setInput } = useQuadrantState();
      setInput('core_quality', 'Decisive');
      setInput('challenge', 'Flexible');

      expect(inputQuadrant.value).toBe('challenge');
      expect(inputValue.value).toBe('Flexible');
    });
  });

  describe('setSuggestions', () => {
    it('should set suggestions for quadrants', () => {
      const { suggestions, setSuggestions } = useQuadrantState();
      setSuggestions({
        pitfall: ['Bossy', 'Domineering', 'Rigid', 'Inflexible', 'Stubborn'],
        challenge: ['Flexible', 'Adaptable', 'Open', 'Receptive', 'Yielding'],
      });

      expect(suggestions.value.pitfall).toHaveLength(5);
      expect(suggestions.value.challenge).toHaveLength(5);
      expect(suggestions.value.pitfall[0]).toBe('Bossy');
    });

    it('should merge with existing suggestions', () => {
      const { suggestions, setSuggestions } = useQuadrantState();
      setSuggestions({ pitfall: ['Suggestion1'] });
      setSuggestions({ challenge: ['Suggestion2'] });

      expect(suggestions.value.pitfall).toEqual(['Suggestion1']);
      expect(suggestions.value.challenge).toEqual(['Suggestion2']);
    });
  });

  describe('selectWord', () => {
    it('should select a word for a specific quadrant', () => {
      const { selectedWords, selectWord } = useQuadrantState();
      selectWord('core_quality', 'Decisive');

      expect(selectedWords.value.core_quality).toBe('Decisive');
    });

    it('should update selection when called multiple times for same quadrant', () => {
      const { selectedWords, selectWord } = useQuadrantState();
      selectWord('pitfall', 'First');
      selectWord('pitfall', 'Second');

      expect(selectedWords.value.pitfall).toBe('Second');
    });

    it('should allow selecting words for multiple quadrants', () => {
      const { selectedWords, selectWord } = useQuadrantState();
      selectWord('core_quality', 'Decisive');
      selectWord('pitfall', 'Bossy');
      selectWord('challenge', 'Flexible');
      selectWord('allergy', 'Indecisive');

      expect(selectedWords.value.core_quality).toBe('Decisive');
      expect(selectedWords.value.pitfall).toBe('Bossy');
      expect(selectedWords.value.challenge).toBe('Flexible');
      expect(selectedWords.value.allergy).toBe('Indecisive');
    });
  });

  describe('isReadyToGenerate', () => {
    it('should return false when no input is set', () => {
      const { isReadyToGenerate } = useQuadrantState();
      expect(isReadyToGenerate.value).toBe(false);
    });

    it('should return false when input value is empty', () => {
      const { isReadyToGenerate, setInput } = useQuadrantState();
      setInput('core_quality', '');
      expect(isReadyToGenerate.value).toBe(false);
    });

    it('should return false when input value is only whitespace', () => {
      const { isReadyToGenerate, setInput } = useQuadrantState();
      setInput('core_quality', '   ');
      expect(isReadyToGenerate.value).toBe(false);
    });

    it('should return true when input quadrant and value are set', () => {
      const { isReadyToGenerate, setInput } = useQuadrantState();
      setInput('core_quality', 'Decisive');
      expect(isReadyToGenerate.value).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const {
        inputQuadrant,
        inputValue,
        suggestions,
        selectedWords,
        setInput,
        setSuggestions,
        selectWord,
        reset,
      } = useQuadrantState();

      // Set up some state
      setInput('core_quality', 'Decisive');
      setSuggestions({ pitfall: ['Bossy', 'Rigid'] });
      selectWord('challenge', 'Flexible');

      // Reset
      reset();

      expect(inputQuadrant.value).toBeNull();
      expect(inputValue.value).toBe('');
      expect(suggestions.value).toEqual({
        core_quality: [],
        pitfall: [],
        challenge: [],
        allergy: [],
      });
      expect(selectedWords.value).toEqual({
        core_quality: '',
        pitfall: '',
        challenge: '',
        allergy: '',
      });
    });
  });
});
