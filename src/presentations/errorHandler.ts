/**
 * エラーハンドラーの定義
 */

import express from 'express';
import { DatabaseFailError } from '../libs/sql';
import { ChainError, ChainErrorOptions } from '../utils';
import logger from '../logger';
import { ZodError } from 'zod';

const errors = {
  unknown: {
    statusCode: 500,
    message:  'その他予期しないエラー',
    errorCode: 0,
  },
  dbError: {
    statusCode: 500,
    message: 'データベース起因のエラー',
    errorCode: 1,
  },
  apiValidationError: {
    statusCode: 400,
    message: 'APIバリデーションエラー',
    errorCode: 2,
  },
} as const;

interface ErrorResponse {
  errorCode: typeof errors[keyof typeof errors]['errorCode'];
}

class ServerError extends ChainError {
  constructor(message?: string, options?: ChainErrorOptions) {
    super(message, options);
    this.name = 'ServerError';
  }
}

class APIValidationError extends ChainError {
  constructor(message?: string, options?: ChainErrorOptions) {
    super(message, options);
    this.name = 'APIValidationError';
  }
}

/**
 * zodエラーをこのアプリ用の例外に変換する
 */
function zodErrorHandler(
  err: unknown,
  _req: express.Request,
  _res: express.Response<ErrorResponse>,
  next: express.NextFunction
) {
  if (err instanceof ZodError) {
    // 変換
    next(new APIValidationError('APIバリデーションエラー', { cause: err } ));
  }
  // それ以外は素通し
  next(err);
}

function errorHandler(
  err: unknown,
  _req: express.Request,
  res: express.Response<ErrorResponse>
) {
  /** エラーログ+レスポンス */
  const errorWith = (
    type: keyof typeof errors,
  ) => {
    logger.error(new ServerError(errors[type].message, { cause: err }));
    res
      .status(errors[type].statusCode)
      .json({
        errorCode: errors[type].errorCode,
      });
  };

  if (err instanceof DatabaseFailError) {
    return errorWith('dbError');
  } else if (err instanceof APIValidationError) {
    return errorWith('apiValidationError');
  } else {
    return errorWith('unknown');
  }
}

export const handler = [zodErrorHandler, errorHandler];