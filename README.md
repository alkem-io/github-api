# github-api
The command line interface for interacting with the Alkemio repository on Github.


## Setup

General instructions are available [from Github](https://docs.github.com/en/graphql/guides/forming-calls-with-graphql).

Generate a personal access token using [Github Instructions](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

Create a `.env` file from the provided `.env.default` file, and place your personal access token there.

## Usage
There are currently two usages of the integration with Github projects:
* **Capacity Planning**:
  * Command to run: `npm run capacity-analysis`
  * Template: this uses `capacity-planning-template.xlsx` as a base and update it with data from the targetted Github project.
* **QA Analysis**:
  * Command to run: `npm run qa-analysis`
  * Template: this uses `qa-analysis-template.xlsx` as a base and update it with data from the targetted Github project.


