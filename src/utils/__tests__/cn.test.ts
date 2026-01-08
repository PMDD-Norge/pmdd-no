import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn utility', () => {
  it('should combine multiple class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'truthy', false && 'falsy')).toBe('base truthy');
  });

  it('should handle object syntax', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });

  it('should handle arrays', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2');
  });

  it('should handle mixed inputs', () => {
    expect(
      cn('base', ['array-class'], { active: true }, false && 'hidden', 'end')
    ).toBe('base array-class active end');
  });

  it('should filter out falsy values', () => {
    expect(cn('base', null, undefined, false, 0, '')).toBe('base');
  });
});
