import sqlite from 'better-sqlite3';
import { Database, DatabaseFailError, DataIntegrityError, NotFoundError, sql } from '../sql';

jest.mock('better-sqlite3');

const mockSqlite = sqlite as unknown as jest.Mock<Partial<ReturnType<typeof sqlite>>>;

describe('one', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockIterate(rows: unknown[]) {
    mockSqlite.mockReturnValue({
      prepare: () => ({
        iterate: () => rows.values(),
      } as never)
    });
  }

  test('クエリ結果が1行ならば、その結果を返す', () => {
    const row = ['test', 'row'];
    mockIterate([row]);

    const db = new Database('filename');
    expect(db.one(sql`SQL`)).toEqual(row);
  });

  test('クエリ結果が2行(以上)ならば、DataIntegrityErrorを投げる', () => {
    const rows = [['test', 'row'], ['row', '2']];
    mockIterate(rows);

    const db = new Database('filename');
    expect(() => db.one(sql`SQL`)).toThrow(DataIntegrityError);
  });

  test('クエリ結果が0行(なし)ならば、NotFoundErrorを投げる', () => {
    const rows: [] = [];
    mockIterate(rows);

    const db = new Database('filename');
    expect(() => db.one(sql`SQL`)).toThrow(NotFoundError);
  });
});

describe('maybeOne', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockIterate(rows: unknown[]) {
    mockSqlite.mockReturnValue({
      prepare: () => ({
        iterate: () => rows.values(),
      } as never)
    });
  }

  test('クエリ結果が1行ならば、その結果を返す', () => {
    const row = ['test', 'row'];
    mockIterate([row]);

    const db = new Database('filename');
    expect(db.maybeOne(sql`SQL`)).toEqual(row);
  });

  test('クエリ結果が2行(以上)ならば、DataIntegrityErrorを投げる', () => {
    const rows = [['test', 'row'], ['row', '2']];
    mockIterate(rows);

    const db = new Database('filename');
    expect(() => db.maybeOne(sql`SQL`)).toThrow(DataIntegrityError);
  });

  test('クエリ結果が0行(なし)ならば、nullを返す', () => {
    const rows: [] = [];
    mockIterate(rows);

    const db = new Database('filename');
    expect(db.maybeOne(sql`SQL`)).toBeNull();
  });
});

describe('クエリ実行に失敗した場合、DatabaseFailErrorをthrowする', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockSqlite.mockReturnValue({
      prepare: () => { throw new Error('some error'); },
    });
  });

  test('any: Errorオブジェクト', () => {
    const db = new Database('filename');
    expect(() => db.any(sql`SQL`)).toThrow(DatabaseFailError);
  });

  test('one: Errorオブジェクト', () => {
    const db = new Database('filename');
    expect(() => db.one(sql`SQL`)).toThrow(DatabaseFailError);
  });

  test('maybeOne: Errorオブジェクト', () => {
    const db = new Database('filename');
    expect(() => db.maybeOne(sql`SQL`)).toThrow(DatabaseFailError);
  });
});