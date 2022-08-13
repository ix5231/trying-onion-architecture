import { Database } from '~/libs/sql';
import { makeVerify } from '../verify';

jest.mock('~/libs/sql');
const MockDatabase = Database as jest.Mock;

test('ID/パスワードが一致する場合、アカウント情報を渡す', () => {
  MockDatabase.mockReturnValue({
    maybeOne: () => ({ loginId: 'id', password: 'password' }),
  });

  const db = new Database('nodb');

  const callback = jest.fn();
  makeVerify(db)('id', 'password', callback);
  expect(callback).toBeCalledWith(null, { id: 'id', password: 'password' });
});

test('例外があった場合は、それをコールバックに渡す', () => {
  const err = new Error('test');
  MockDatabase.mockReturnValue({
    maybeOne: () => { throw err; }
  });

  const db = new Database('nodb');

  const callback = jest.fn();
  makeVerify(db)('id', 'password', callback);
  expect(callback).toBeCalledWith(err);
});

test('アカウントがない場合、エラーメッセージをコールバックに渡す', () => {
  MockDatabase.mockReturnValue({
    maybeOne: () => null,
  });

  const db = new Database('nodb');

  const callback = jest.fn();
  makeVerify(db)('id', 'password', callback);
  expect(callback).toBeCalledWith(null, false, { message: 'IDまたはパスワードが間違っています' });
});

test('パスワードが一致しない場合、エラーメッセージをコールバックに渡す', () => {
  MockDatabase.mockReturnValue({
    maybeOne: () => ({ loginId: 'id', password: 'something' }),
  });

  const db = new Database('nodb');

  const callback = jest.fn();
  makeVerify(db)('id', 'password', callback);
  expect(callback).toBeCalledWith(null, false, { message: 'IDまたはパスワードが間違っています' });
});