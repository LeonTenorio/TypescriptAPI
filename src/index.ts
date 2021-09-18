import express from 'express';
import { json } from 'body-parser';
import { connectDatabase } from './config/database';
import { router as dummyRouter } from './router/dummy';
import { router as authRouter } from './router/auth';
import { Command } from 'commander';
import dotenv from 'dotenv';

const program = new Command();

program.option('-p, --prod', 'production env');
program.option('-b, --beta', 'beta env');
program.option('-l, --local', 'local env');

program.parse(process.argv);

const options = program.opts();

if (options.prod) {
  dotenv.config({ path: '.env.prod' });
} else if (options.beta) {
  dotenv.config({ path: '.env.beta' });
} else {
  dotenv.config({ path: '.env' });
}

const app = express();
app.use(json({ limit: '50mb' }));

app.use(dummyRouter);
app.use(authRouter);

app.listen(3000, async () => {
  console.log('server is listening on port 3000');
  await connectDatabase();
  console.log('connected to mongodb');
});
