import { ChainError, ChainErrorOptions } from '../../utils';

export class ServerError extends ChainError {
  constructor(message?: string, options?: ChainErrorOptions) {
    super(message, options);
    this.name = 'ServerError';
  }
}

export class APIValidationError extends ChainError {
  constructor(message?: string, options?: ChainErrorOptions) {
    super(message, options);
    this.name = 'APIValidationError';
  }
}