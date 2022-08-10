import sqlite from 'better-sqlite3';

/**
 * データベース関係のエラー
 */
export class DatabaseError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'DatabaseError';
  }
}

/**
 * データベース起因のエラー
 */
export class DatabaseFailError extends DatabaseError {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'DatabaseFailError';
  }
}

/**
 * 問い合わせに合致する行がない
 */
export class NotFoundError extends DatabaseError {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'NotFoundError';
  }
}

/**
 * クエリ実行結果が想定したものでない
 */
export class DataIntegrityError extends DatabaseError {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'DataIntegrityError';
  }
}

type Param = boolean | string | number;

interface Statement {
  rawSqlQuery: string;
  params: Param[];
}

/**
 * SQLite向けのクエリを生成する
 */
export function sql(queryDelim: TemplateStringsArray, ...params: Param[]): Statement {
  return {
    rawSqlQuery: queryDelim.join('?'),
    params,
  };
}

type Row = Record<string, unknown>;

// 非Errorオブジェクトがthrowされる可能性は低く、テストする意味が薄いので除外
/* istanbul ignore next */
function failWith(e: unknown): never {
  if (e instanceof Error) {
    throw new DatabaseFailError('DBエラー', { cause: e });
  } else {
    throw new DatabaseFailError(`DBエラー: ${JSON.stringify(e)}`);
  }
}

/**
 * データベースコネクション
 */
export class Database {
  #db: sqlite.Database;
  
  /**
   * @param filename データベースファイル
   */
  constructor(filename: string) {
    this.#db = sqlite(filename);
  }
  
  /**
   * クエリを実行する
   * 
   * @param query クエリ
   * @returns 結果
   * @throws {QueryFailError} クエリの実行に失敗した
   */
  any(query: Statement): Row[] {
    try {
      return this.#db.prepare(query.rawSqlQuery).all(...query.params);
    } catch (e) {
      failWith(e);
    }
  }
  
  /**
   * クエリを実行し、1行分のデータを返す
   * 
   * @param query クエリ
   * @returns 結果
   * @throws {DatabaseFailError} クエリの実行に失敗した
   * @throws {NotFoundError} 合致する結果が存在しなかった
   * @throws {DataIntegrityError} 複数行見つかった
   */
  one(query: Statement): Row {
    const result = this.maybeOne(query);
    if (!result) {
      throw new NotFoundError('合致する結果が見つかりませんでした');
    }
    return result;
  }

  /**
   * クエリを実行し、1行分のデータを返す
   *
   * 
   * @param query クエリ
   * @returns 結果、存在しなかった場合は`null`を返す
   * @throws {DatabaseFailError} クエリの実行に失敗した
   * @throws {DataIntegrityError} 複数行見つかった
   */
  maybeOne(query: Statement): Row | null {
    let foundRows;
    try {
      foundRows = this.#db.prepare(query.rawSqlQuery).iterate(...query.params);
    } catch (e) {
      failWith(e);
    }

    const row = foundRows.next();
    if (row.done) {
      return null;
    }
    const nextRow = foundRows.next();
    if (!nextRow.done) {
      throw new DataIntegrityError('結果が1行であることを予期していましたが、実際は複数行存在しています');
    }
    return row.value;
  }
  
  // ただのライブラリのテストなので除外
  /* istanbul ignore next */
  close(): void {
    this.#db.close();
  }
}