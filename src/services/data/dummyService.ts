import { ClientSession, Db, Document } from 'mongodb';
import { DatabaseResult } from '../../structure/databaseResult';

const collection: string = 'Dummy';

type IDummy = {
  message: string;
  time: Date;
};

function castDbData(data: Document): IDummy {
  const castData = data as any as IDummy;
  return castData;
}

export const addDymmyData = async (
  data: IDummy,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  try {
    await db.collection(collection).insertOne(data, { session });
    return { success: true, data: null };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

export const readDummyDatas = async (
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Array<IDummy>>> => {
  try {
    const response = await db.collection(collection).find({}).toArray();

    return {
      success: true,
      data: response.map((data) => castDbData(data)),
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

export const updateDummyData = async (
  time: Date,
  data: Partial<IDummy>,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  try {
    await db.collection(collection).findOneAndUpdate({ time: time }, data);

    return {
      success: true,
      data: null,
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};
