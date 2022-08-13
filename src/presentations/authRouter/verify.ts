import type { IVerifyOptions } from 'passport-local';
import { Database, sql } from '~/libs/sql';
import logger from '~/logger';
import { accountValidator } from './accountValidator';

export function makeVerify(db: Database) {
  return (
    id: string,
    password: string,
    callback: (error: unknown, user?: unknown, options?: IVerifyOptions) => void
  ) => {
    logger.debug(`ログイン認証開始 ID: ${id}`);
    try {
      const row = db.maybeOne(sql`SELECT * FROM TbmLogin WHERE loginId = ${id}`);
      if (!row) {
        logger.debug('データなし');
        return callback(null, false, { message: 'IDまたはパスワードが間違っています' });
      }
      const account = accountValidator.parse({ id: row.loginId, password: row.password });
      if (password !== account.password) {
        logger.debug('パスワード不一致');
        return callback(null, false, { message: 'IDまたはパスワードが間違っています' });
      }
      return callback(null, account);
    } catch (e) {
      return callback(e);
    }
  };
}