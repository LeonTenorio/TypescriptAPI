import { MongoClient, ClientSession, Db, Transaction } from 'mongodb';
import environmentVariables from './environmentVariables';

const client = new MongoClient(environmentVariables().MONGODB_URL);

export type DatabaseService<T> = (db: Db, session: ClientSession) => Promise<T>;

export enum TransactionModes {
  default = 1,
}

export const withDatabaseTransaction = async <T>(
  service: DatabaseService<T>,
  transactionMode: TransactionModes = TransactionModes.default,
  rollback?: boolean
): Promise<T> => {
  await client.connect();
  const session = client.startSession();

  const transactionOptions = {};

  const result = new Promise<T>(async (resolve, reject) => {
    try {
      await session.withTransaction(async () => {
        const result = await service(client.db(), session);
        if (rollback !== undefined && rollback) {
          await session.abortTransaction();
          await session.endSession();
          await client.close();
        } else {
          await session.commitTransaction();
          await session.endSession();
          await client.close();
        }
        resolve(result);
      });
    } catch (e) {
      console.warn('MONGODB ERROR');
      console.warn(e);
      await session.endSession();
      await client.close();
      reject(e);
    }
  });

  return result;
};
