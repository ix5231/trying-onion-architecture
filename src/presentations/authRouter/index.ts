import { Router } from 'express';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { db } from '~/db';
import logger from '~/logger';
import { accountValidator } from './accountValidator';
import { makeVerify } from './verify';

passport.use(
  new Strategy(
    { usernameField: 'id' },
    makeVerify(db)
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