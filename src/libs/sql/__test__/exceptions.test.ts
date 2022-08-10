import * as sqlModule from '..';

test.each([
  ['DatabaseError', sqlModule.DatabaseError],
  ['DataIntegrityError', sqlModule.DataIntegrityError],
  ['DatabaseFailError', sqlModule.DatabaseFailError],
  ['NotFoundError', sqlModule.NotFoundError],
])('メッセージと名前が設定されている: %s', (name, errorClass) => {
  const msg = 'Message';
  const error = new errorClass(msg);
  expect(error.name).toBe(name);
  expect(error.message).toBe(msg);
});