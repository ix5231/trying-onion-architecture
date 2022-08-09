/**
 * @file サーバの初期設定・開始
 */
 
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
// import csurf from 'csurf';
import passport from 'passport';
import log4js from 'log4js';
import { db } from './db';
import { httpLogger, appLogger } from './logger';
import authRouter from './presentations/authRouter';
import { handler as errorHandler } from './presentations/errorHandler';

if (!process.env.SECRET) {
  console.error('Environment variable SECRET is required');
  process.exit(1);
}

export const app = express();

// Expressのアプリケーション設定
app.set('view engine', 'ejs');
app.set('views', [
  path.resolve(__dirname, '..', 'views'),
]);

// 外部middleware
app.use(log4js.connectLogger(httpLogger, {
  level: 'info',
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true },
}));
// app.use(csurf());
app.use(passport.authenticate('session'));

app.get('/', (_req, res, next) => {
  res.send('Hi');
  return next();
});

app.get('/login', (_req, res, next) => {
  res.render('login');
  return next();
});

app.use('/api', authRouter);

app.use(errorHandler);

app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ 'message': 'NOT FOUND '});
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  if (!process.env.PORT) {
    appLogger.debug('ポート指定なし、3000にフォールバック');
  }
  appLogger.info(`サーバー開始 PORT:${port}`);
});

server.on('close', () => {
  db.close();
});