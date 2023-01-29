/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLClient } from 'graphql-request';
import { Sdk, getSdk, Issue } from '../generated/graphql';
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

  public async issuesInRepo(
    repoName: string,
    limit: number
  ): Promise<string[]> {
    const result = await this.sdkClient.repository({ repoName, limit });

    const titles: string[] = [];
    const issues = result.data.repository?.issues?.edges || [];
    for (const issue of issues) {
      const issueNode: Issue | undefined = issue?.node as Issue;
      if (issueNode) {
        const labels = this.getLabelsForIssue(issueNode);
        this.logger.info?.(`Issue: [${labels}] - ${JSON.stringify(issue)}`);
        const node = issue?.node;
        if (node) {
          const title = `${node.title}`;
          titles.push(title);
        }
      }
    }
    return titles;
  }

  public async projects(organization: string, projectID: number) {
    const result = await this.sdkClient.projects({ organization, projectID });

    this.logger.info?.(`Projects: [${result}] `);

    return result;
  }

  private getLabelsForIssue(issue: Issue): string[] {
    const labelEdges = issue.labels?.edges || [];
    const result: string[] = [];

    for (const labelEdge of labelEdges) {
      if (labelEdge) {
        const nodeName = labelEdge.node?.name;
        if (nodeName) {
          result.push(nodeName);
        }
      }
    }
    return result;
  }
}
