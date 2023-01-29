import dotenv from 'dotenv';
import { GithubClientConfig } from '../config';

const GITHUB_ENDPOINT = 'https://api.github.com/graphql';

export const createConfigUsingEnvVars = (): GithubClientConfig => {
  dotenv.config();

  const apiToken = process.env.PERSONAL_ACCESS_TOKEN || 'no_token_provided';

  return {
    apiToken: apiToken,
    apiEndpoint: GITHUB_ENDPOINT,
  };
};
