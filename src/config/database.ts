import { MongoClient, ClientSession, Db } from 'mongodb';
import environmentVariables from './environmentVariables';

const client = new MongoClient(environmentVariables().MONGODB_URL);

export type DatabaseService<T> = (db: Db, session: ClientSession) => Promise<T>;

export const withDatabaseTransaction = async <T>(
  service: DatabaseService<T>
): Promise<T> => {
  await client.connect();
  const session = client.startSession();

  const transactionOptions = {};

  try {
    let result: T | undefined = undefined;

    await session.withTransaction(async () => {
      result = await service(client.db(), session);
    }, transactionOptions);

    await session.commitTransaction();
    await session.endSession();
    await client.close();

    if (result === undefined) {
      throw Error("Can't execute the service");
    }

    return result;
  } catch (e) {
    console.warn('MONGODB ERROR');
    console.warn(e);
    await session.abortTransaction();
    await session.endSession();
    await client.close();
    throw e as Error;
  }
};
