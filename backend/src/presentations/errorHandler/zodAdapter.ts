import express from 'express';
import { ZodError } from 'zod';
import { APIValidationError } from './errors';

/**
 * zodエラーをこのアプリ用の例外に変換する
 */
export function zodAdapter(
  err: unknown,
  _req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) {
  if (err instanceof ZodError) {
    // 変換
    next(new APIValidationError('APIバリデーションエラー', { cause: err } ));
  }
  // それ以外は素通し
  next(err);
}