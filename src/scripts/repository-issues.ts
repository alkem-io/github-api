import { createConfigUsingEnvVars } from '../util/create-config-using-envvars';
import { GithubClient } from '../client/GithubCliClient';
import { createLogger } from '../util/create-logger';
import { getOcto } from '../client/octo';

const main = async () => {
  await viewer();
};

export const viewer = async () => {
  const logger = createLogger();
  const config = createConfigUsingEnvVars();

  const githubClient = new GithubClient(config, logger);
  await githubClient.initialise();

  const titles = await githubClient.issuesInRepo('server', 5);
  for (const title of titles) {
    logger.info?.(`Result: ${title}`);
  }
};

main().catch(error => {
  console.error(error);
});


const test = async () => {
  const octokit = getOcto();
  const { data: {  } } = await octokit.rest.issues.listForOrg({
    filter: 'all',
    org: 'alkem-io',
  })
  const iterator = octokit.paginate.iterator(octokit.rest.issues.listForOrg, {
    owner: "octocat",
    repo: "hello-world",
    per_page: 100,
  });


// iterate through each response
  for await (const { data: issues } of iterator) {
    for (const issue of issues) {
      console.log("Issue #%d: %s", issue.number, issue.title);
    }
  }
};
