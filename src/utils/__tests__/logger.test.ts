import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger, logError } from '../logger';

describe('logger utility', () => {
  // Store original console methods
  const originalConsole = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  beforeEach(() => {
    // Mock console methods
    console.debug = vi.fn();
    console.info = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    // Restore original console methods
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  it('should log debug messages', () => {
    logger.debug('Debug message');
    expect(console.debug).toHaveBeenCalled();
  });

  it('should log info messages', () => {
    logger.info('Info message');
    expect(console.info).toHaveBeenCalled();
  });

  it('should log warn messages', () => {
    logger.warn('Warning message');
    expect(console.warn).toHaveBeenCalled();
  });

  it('should log error messages', () => {
    logger.error('Error message');
    expect(console.error).toHaveBeenCalled();
  });

  it('should include context in log', () => {
    logger.info('Test', { userId: '123' });
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('INFO:'),
      'Test',
      { userId: '123' }
    );
  });

  it('should handle Error objects in logError', () => {
    const error = new Error('Test error');
    logError(error);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('ERROR:'),
      'Test error',
      expect.objectContaining({
        stack: expect.any(String),
        name: 'Error',
      })
    );
  });

  it('should handle non-Error objects in logError', () => {
    logError('String error');
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('ERROR:'),
      'Unknown error occurred',
      expect.objectContaining({
        error: 'String error',
      })
    );
  });
});
