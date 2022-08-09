/**
 * @file アプリケーションで使うDBクライアントの初期化
 */

import { Database } from './libs/sql';

if (!process.env.DATABASE_FILE) {
  console.error('Environment variable DATABASE_FILE is required');
  process.exit(1);
}

export const db = new Database(process.env.DATABASE_FILE);