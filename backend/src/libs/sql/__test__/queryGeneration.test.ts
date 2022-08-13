import { sql } from '..';

test('クエリ作成', () => {
  const id = 10;
  const name = 'test';
  expect(sql`SELECT * FROM some_table WHERE id = ${id} AND name = ${name}`).toEqual({
    rawSqlQuery: 'SELECT * FROM some_table WHERE id = ? AND name = ?',
    params: [id, name],
  });
});