import { createConfigUsingEnvVars } from '../util/create-config-using-envvars';
import { GithubClient } from '../client/GithubCliClient';
import { createLogger } from '../util/create-logger';

const main = async () => {
  await projects();
};

export const projects = async () => {
  const logger = createLogger();
  const config = createConfigUsingEnvVars();

  const githubClient = new GithubClient(config, logger);
  await githubClient.initialise();

  const result = await githubClient.projects('alkem-io', 4);

  logger.info?.(`Result: ${JSON.stringify(result)}`);
};

main().catch(error => {
  console.error(error);
});
