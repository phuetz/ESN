import {
  isValidEmail,
  isValidPhone,
  validatePassword,
  isValidUrl,
  isDateInFuture,
  isValidDateRange,
  isInRange,
  validateRequiredFields,
  isValidPostalCode,
} from '../validation';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('should handle empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate French phone number', () => {
      expect(isValidPhone('0612345678')).toBe(true);
    });

    it('should validate international format', () => {
      expect(isValidPhone('33612345678')).toBe(true);
    });

    it('should reject invalid phone', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('0')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = validatePassword('MyPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short password', () => {
      const result = validatePassword('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('password123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without numbers', () => {
      const result = validatePassword('Password!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URL', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
    });

    it('should reject invalid URL', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
    });
  });

  describe('isDateInFuture', () => {
    it('should detect future date', () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      expect(isDateInFuture(future)).toBe(true);
    });

    it('should detect past date', () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      expect(isDateInFuture(past)).toBe(false);
    });
  });

  describe('isValidDateRange', () => {
    it('should validate correct date range', () => {
      const start = new Date('2025-01-01');
      const end = new Date('2025-12-31');
      expect(isValidDateRange(start, end)).toBe(true);
    });

    it('should reject invalid date range', () => {
      const start = new Date('2025-12-31');
      const end = new Date('2025-01-01');
      expect(isValidDateRange(start, end)).toBe(false);
    });
  });

  describe('isInRange', () => {
    it('should validate number in range', () => {
      expect(isInRange(50, 0, 100)).toBe(true);
      expect(isInRange(0, 0, 100)).toBe(true);
      expect(isInRange(100, 0, 100)).toBe(true);
    });

    it('should reject number out of range', () => {
      expect(isInRange(-1, 0, 100)).toBe(false);
      expect(isInRange(101, 0, 100)).toBe(false);
    });
  });

  describe('validateRequiredFields', () => {
    it('should validate all required fields present', () => {
      const data = { name: 'John', email: 'john@example.com' };
      const result = validateRequiredFields(data, ['name', 'email']);
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toHaveLength(0);
    });

    it('should detect missing fields', () => {
      const data = { name: 'John' };
      const result = validateRequiredFields(data, ['name', 'email']);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('email');
    });

    it('should detect empty fields', () => {
      const data = { name: '', email: 'test@example.com' };
      const result = validateRequiredFields(data, ['name', 'email']);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('name');
    });
  });

  describe('isValidPostalCode', () => {
    it('should validate French postal code', () => {
      expect(isValidPostalCode('75001')).toBe(true);
      expect(isValidPostalCode('69001')).toBe(true);
    });

    it('should reject invalid postal code', () => {
      expect(isValidPostalCode('7500')).toBe(false);
      expect(isValidPostalCode('750011')).toBe(false);
      expect(isValidPostalCode('ABCDE')).toBe(false);
    });
  });
});
