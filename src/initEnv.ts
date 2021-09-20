import { Command } from 'commander';
import dotenv from 'dotenv';

/**
 * Function to select what environment we will, the local, beta or prod env.
 */
export default function (): void {
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

    process.env.ENV = 'PROD';
  } else if (options.beta) {
    /**
     * The beta environment using the beta firebase configuration
     * and the beta mongodb database
     */
    dotenv.config({ path: '.env.beta' });
    process.env.ENV = 'BETA';
  } else {
    /**
     * The local environment using the local firebase emulation and
     * the local mongodb database
     */
    dotenv.config({ path: '.env' });
    process.env.ENV = 'LOCAL';
  }
}
