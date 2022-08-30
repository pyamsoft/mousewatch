import { BotConfig } from "../config";
import { newLogger } from "../bot/logger";
import { ensurePoolConnection } from "./ConnectionPool";

const logger = newLogger("Database");

export interface DatabaseResult<T> {
  data: T | undefined;
  error: Error | undefined;
}

export interface Database {
  query: <T>(
    sql: string,
    variables: any[],
    mapper: (row: object) => T
  ) => Promise<DatabaseResult<T[]>>;

  insert: (sql: string, variables: any[]) => Promise<DatabaseResult<boolean>>;

  update: (sql: string, variables: any[]) => Promise<DatabaseResult<boolean>>;
}

export const createNewDatabase = function (config: BotConfig): Database {
  const p = ensurePoolConnection(config);

  return {
    query: async function <T>(
      sql: string,
      variables: any[],
      mapper: (row: object) => T
    ): Promise<DatabaseResult<T[]>> {
      try {
        const result = await p.query(sql, variables);
        const data = (result.rows || []).map((r) => mapper(r));
        return {
          data,
          error: undefined,
        };
      } catch (e) {
        logger.error(e, "Error querying database: ", {
          sql,
          variables,
        });
        return {
          data: undefined,
          error: e as any,
        };
      }
    },

    insert: async function (
      sql: string,
      variables: any[]
    ): Promise<DatabaseResult<boolean>> {
      try {
        await p.query(sql, variables);
        return {
          data: true,
          error: undefined,
        };
      } catch (e) {
        logger.error(e, "Error inserting database: ", {
          sql,
          variables,
        });
        return {
          data: undefined,
          error: e as any,
        };
      }
    },

    update: async function (
      sql: string,
      variables: any[]
    ): Promise<DatabaseResult<boolean>> {
      try {
        await p.query(sql, variables);
        return {
          data: true,
          error: undefined,
        };
      } catch (e) {
        logger.error(e, "Error updating database: ", {
          sql,
          variables,
        });
        return {
          data: undefined,
          error: e as any,
        };
      }
    },
  };
};
