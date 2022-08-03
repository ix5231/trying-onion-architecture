import path from 'path';
import express from 'express';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', [
  path.resolve(__dirname, '..', 'views'),
]);

app.use(express.urlencoded({ extended: false }));

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