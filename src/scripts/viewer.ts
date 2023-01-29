import { createConfigUsingEnvVars } from '../util/create-config-using-envvars';
import { GithubClient } from '../client/GithubCliClient';
import { createLogger } from '../util/create-logger';

const main = async () => {
  await viewer();
};

export const viewer = async () => {
  const logger = createLogger();
  const config = createConfigUsingEnvVars();

  const githubClient = new GithubClient(config, logger);
  await githubClient.initialise();

  const result = await githubClient.repository();
  logger.info?.(`Result: ${JSON.stringify(result)}`);
};

main().catch(error => {
  console.error(error);
});
