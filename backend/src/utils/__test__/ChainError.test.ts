import { ChainError } from '..';

test('Errorオブジェクトが渡された場合、causeにそのエラーが格納される', () => {
  const errorObj = new Error('error');
  expect(new ChainError('msg', { cause: errorObj }).cause).toBe(errorObj);
});

test('何も渡されなかった場合、causeはundefinedになる', () => {
  const error = new ChainError('msg');
  expect(error.cause).toBeUndefined();
});

test('非Errorオブジェクトが渡された場合、causeに別のエラーでラップされ格納される', () => {
  const error = new ChainError('msg', { cause: 'some value' });
  expect(error.cause).toBeInstanceOf(Error);
  expect(error.cause?.message).toMatch(/some value/);
});