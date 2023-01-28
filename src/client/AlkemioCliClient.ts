/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLClient } from 'graphql-request';
import {
  Sdk,
  getSdk,
  OrganizationAuthorizationResetInput,
  HubAuthorizationResetInput,
  UserAuthorizationResetInput,
} from '../generated/graphql';
import { Logger } from 'winston';

export class GithubClient {
  public config!: GithubClientConfig;
  public sdkClient!: Sdk;
  public logger: Logger;

  constructor(config: GithubClientConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
    this.logger.info(`Alkemio server: ${config.apiEndpointPrivateGraphql}`);
  }

  async initialise() {
    try {
      const apiToken = this.alkemioLibClient.apiToken;

      this.logger.info(`API token: ${apiToken}`);
      const client = new GraphQLClient(this.config.apiEndpointPrivateGraphql, {
        headers: {
          authorization: `Bearer ${apiToken}`,
        },
      });
      this.sdkClient = getSdk(client);
    } catch (error) {
      throw new Error(`Unable to create client for Alkemio endpoint: ${error}`);
    }
  }

  public async hubsAllVisibilities() {
    const result = await this.sdkClient.hubsAllVisibilities();

    return result.data.hubs;
  }
}
