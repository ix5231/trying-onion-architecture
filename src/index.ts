/**
 * @file サーバの初期設定・ルーティング・開始
 */

import path from 'path';
import express from 'express';
import session from 'express-session';
import csurf from 'csurf';
import passport from 'passport';

if (!process.env.SECRET) {
  console.error('Environment variable SECRET is required');
  process.exit(1);
}

const app = express();
const port = 3000;

// Expressのアプリケーション設定
app.set('view engine', 'ejs');
app.set('views', [
  path.resolve(__dirname, '..', 'views'),
]);

// 外部middleware
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true },
}));
app.use(csurf());
app.use(passport.authenticate('session'));

app.get('/', (_req, res, next) => {
  res.send('Hi');
  return next();
});

app.get('/login', (req, res, next) => {
  res.render('login');
  return next();
});

app.post('/login', (req, res, next) => {
  console.log(req.body);
  res.send('Hi');
  return next();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});