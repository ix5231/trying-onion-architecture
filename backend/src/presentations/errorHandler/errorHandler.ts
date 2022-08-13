import express from 'express';
import { DatabaseFailError } from '../../libs/sql';
import logger from '../../logger';
import { ServerError, APIValidationError } from './errors';

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

/**
 * エラーハンドラー
 */
export function errorHandler(
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