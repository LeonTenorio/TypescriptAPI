import dummyService from './dummyService';
import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';

jest.setTimeout(10000);

test('', async () => {
  const service: DatabaseService<void> = async (db, session) => {
    const dummyData = { message: 'test', time: new Date() };

    const readBeforeInsertion = await dummyService.readDummyDatas(db, session);
    expect(readBeforeInsertion.success).toBe(true);

    const addResult = await dummyService.addDymmyData(dummyData, db, session);
    expect(addResult.success).toBe(true);

    const readAfterInsertion = await dummyService.readDummyDatas(db, session);
    expect(
      readAfterInsertion.success &&
        readBeforeInsertion.success &&
        readAfterInsertion.data.length - readBeforeInsertion.data.length === 1
    ).toBe(true);
  };

  await withDatabaseTransaction(service, undefined, true);
});
