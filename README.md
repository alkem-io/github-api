# github-api
The command line interface for interacting with the Alkemio repository on Github.


## Setup

General instructions are available [from Github](https://docs.github.com/en/graphql/guides/forming-calls-with-graphql).

Generate a personal access token using [Github Instructions](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

Create a `.env` file from the provided `.env.default` file, and place your personal access token there.

## Usage
To execute the flow run `npm run projects`

This will use the `capacity-planning-template.xlsx` as a base and update it with data from the targetted Github project.


