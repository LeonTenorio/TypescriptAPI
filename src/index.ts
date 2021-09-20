import express from 'express';
import { json } from 'body-parser';
import { connectDatabase } from './config/database';
import { router as dummyRouter } from './router/dummy';
import { router as authRouter } from './router/auth';
import initEnv from './initEnv';

initEnv();

const app = express();
app.use(json({ limit: '50mb' }));

app.use(dummyRouter);
app.use(authRouter);

app.listen(3000, async () => {
  console.log('server is listening on port 3000');
  await connectDatabase();
  console.log('connected to mongodb');
});
