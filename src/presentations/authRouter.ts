import { Router } from 'express';
import passport from 'passport';
import { IVerifyOptions, Strategy } from 'passport-local';
import { z } from 'zod';
import { db } from '../db';
import logger from '../logger';
import { sql } from '../libs/sql';

const accountValidator = z.object({
  id: z.string(),
  password: z.string(),
});
  
function verify(
  id: string,
  password: string,
  callback: (error: unknown, user?: unknown, options?: IVerifyOptions) => void
) {
  logger.debug(`ログイン認証開始 ID: ${id}`);
  try {
    const row = db.maybeOne(sql`SELECT * FROM TbmLogin WHERE loginId = ${id}`);
    if (!row) {
      logger.debug('データなし');
      return callback(null, false, { message: 'IDまたはパスワードが間違っています' });
    }
    const account = accountValidator.parse({ iid: row.loginId, password: row.password });
    if (password !== account.password) {
      logger.debug('パスワード不一致');
      return callback(null, false, { message: 'IDまたはパスワードが間違っています' });
    }
    return callback(null, account);
  } catch (e) {
    return callback(e);
  }
}

passport.use(
  new Strategy(
    { usernameField: 'id' },
    verify
  )
);

passport.serializeUser((user, callback) => {
  try {
    logger.debug('ユーザのシリアライズ開始');
    const account = accountValidator.parse(user);
    process.nextTick(() => {
      callback(null, { id: account.id });
    });
  } catch (e) {
    callback(e);
  }
});

passport.deserializeUser((user, callback) => {
  try {
    logger.debug('ユーザのデシリアライズ開始');
    const account = accountValidator.parse(user);
    process.nextTick(() => callback(null, account));
  } catch (e) {
    callback(e);
  }
});

const router = Router();

router.post(
  '/login',
  passport.authenticate('local'),
  (_req, res) => {
    res.status(200).json({ status: 'OK '});
  }
);

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

export default router;