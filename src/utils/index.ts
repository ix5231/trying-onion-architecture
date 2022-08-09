import path from 'path';

/**
 * エラーの各種オプション
 */
export interface ChainErrorOptions extends ErrorOptions {
  /**
   * エラーの発生原因
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cause: any;
}

class ValueThrownError extends Error {
  constructor(value: unknown) {
    super(`Non error object thrown: ${JSON.stringify(value)}`);
    this.name = 'ValueThrownError';
  }
}

/**
 * チェイン可能な例外
 */
export class ChainError extends Error {
  /**
   * @param message エラーメッセージ
   * @param options オプション
   */
  constructor(message?: string, options?: ChainErrorOptions) {
    if (options?.cause instanceof Error) {
      super(message, options);
    } else {
      super(message, {
        cause: new ValueThrownError(options?.cause),
        ...options
      });
    }
  } 
}

export const projectRoot = path.resolve(__dirname, '..', '..');