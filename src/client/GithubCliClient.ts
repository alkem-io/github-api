/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLClient } from 'graphql-request';
import { Sdk, getSdk } from '../generated/graphql';
import { Logger } from 'winston';
import { GithubClientConfig } from '../config';

export class GithubClient {
  public config!: GithubClientConfig;
  public sdkClient!: Sdk;
  public logger: Logger;

  constructor(config: GithubClientConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
    this.logger.info(`Github endpoint: ${this.config.apiEndpoint}`);
  }

  async initialise() {
    try {
      const apiToken = this.config.apiToken;
      this.logger.info(`API token: ${apiToken}`);
      const client = new GraphQLClient(this.config.apiEndpoint, {
        headers: {
          authorization: `Bearer ${apiToken}`,
        },
      });
      this.sdkClient = getSdk(client);
    } catch (error) {
      throw new Error(`Unable to create client for Github endpoint: ${error}`);
    }
  }

  public async testQuery() {
    const result = await this.sdkClient.viewer();

    return result;
  }

  public async repository() {
    const result = await this.sdkClient.repository();

    return result;
  }
}
