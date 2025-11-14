import {
  formatCurrency,
  formatNumber,
  formatPhone,
  truncate,
  getInitials,
  formatPercentage,
  capitalize,
  snakeToTitle,
} from '../format';

describe('Format Utils', () => {
  describe('formatCurrency', () => {
    it('should format number as EUR currency', () => {
      expect(formatCurrency(1500)).toBe('1 500,00 €');
    });

    it('should format with different currency', () => {
      expect(formatCurrency(100, 'USD')).toContain('100');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('0,00 €');
    });
  });

  describe('formatNumber', () => {
    it('should format number with thousands separator', () => {
      expect(formatNumber(1234567)).toBe('1 234 567');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(123)).toBe('123');
    });
  });

  describe('formatPhone', () => {
    it('should format French phone number', () => {
      expect(formatPhone('0612345678')).toBe('06 12 34 56 78');
    });

    it('should handle already formatted numbers', () => {
      const formatted = formatPhone('06 12 34 56 78');
      expect(formatted).toContain('06');
    });

    it('should handle non-standard formats', () => {
      const phone = formatPhone('123');
      expect(phone).toBe('123');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      expect(truncate('This is a long text', 10)).toBe('This is...');
    });

    it('should not truncate short text', () => {
      expect(truncate('Short', 10)).toBe('Short');
    });

    it('should handle exact length', () => {
      expect(truncate('Exactly10!', 10)).toBe('Exactly10!');
    });
  });

  describe('getInitials', () => {
    it('should get initials from names', () => {
      expect(getInitials('John', 'Doe')).toBe('JD');
    });

    it('should handle lowercase names', () => {
      expect(getInitials('john', 'doe')).toBe('JD');
    });

    it('should handle single character names', () => {
      expect(getInitials('A', 'B')).toBe('AB');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage with default decimals', () => {
      expect(formatPercentage(75)).toBe('75%');
    });

    it('should format percentage with specified decimals', () => {
      expect(formatPercentage(75.567, 2)).toBe('75.57%');
    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('0%');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should lowercase the rest', () => {
      expect(capitalize('HELLO')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('snakeToTitle', () => {
    it('should convert snake_case to Title Case', () => {
      expect(snakeToTitle('hello_world')).toBe('Hello World');
    });

    it('should handle single word', () => {
      expect(snakeToTitle('hello')).toBe('Hello');
    });

    it('should handle multiple underscores', () => {
      expect(snakeToTitle('this_is_a_test')).toBe('This Is A Test');
    });
  });
});
