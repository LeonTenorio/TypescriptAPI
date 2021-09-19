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
  /**
   * The production environment using the production firebase
   * configuration and the production mongodb database
   */
  dotenv.config({ path: '.env.prod' });
} else if (options.beta) {
  /**
   * The beta environment using the beta firebase configuration
   * and the beta mongodb database
   */
  dotenv.config({ path: '.env.beta' });
} else {
  /**
   * The local environment using the local firebase emulation and
   * the local mongodb database
   */
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
