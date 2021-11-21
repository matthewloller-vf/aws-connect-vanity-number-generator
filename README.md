# AWS Connect Demo Project - Vanity Number Generator

This project is intended to exercise some basic functionality of AWS Connect. It sets up a lambda function which will receive a contact flow event from a configured AWS Connect instance, extract the caller's phone number, and generate up to 5 vanity phone numbers from it.

## Requirements

* *(optional)* [nvm](https://github.com/nvm-sh/nvm) - used to manage multiple nodejs installations on a single computer
* [Nodejs v14 Fermium LTS](https://nodejs.org/download/release/latest-v14.x/)
* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* *(optional)* aws-cdk global install - `npm i -g aws-cdk` - the CDK cli can either be run from a global install or from within this project. The global install will allow you to execute CDK command directly ex. `cdk synth` or `cdk deploy` but do not preserve the version of CDK that the project was initially built with.

## Setup

The following steps should get your environment set up and allow you to build and deploy your application to your AWS account.

1. [AWS setup guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-prereqs.html) - get your AWS account setup and your AWS CLI configured with credentials for interacting with your AWS account.
2. `nvm use` or `nvm use 14` - install/switch nodejs environment. The `nvm use` command expects that you are in the root of this project and an .nvmrc file exists.
3. `npm i` - install project packages
4. `npx cdk bootstrap aws://<account-number>/<region>` - the CDK requires some initial setup and deployment of resources in your AWS account. This command creates a stack with those default resources and allows you to deploy your main application stack.
5. `npx cdk doctor` - this command determines if the CDK has everything it needs to deploy. When ran the output provides details on the default account and region that CDK stack will deploy to.

## Build

### Build - Stack
* `npx cdk synth` - build cloudformation templates from CDK app

### Build - Source (lambda functions)
* `npx tsc` - compile the typescript files into javascript for deployment. Note: this doesn't need to be done explicitly but will allow you to detect any errors in your code if a typescript linter is not present.

## Deploy 

> **Important**: the project is set up to deploy using the configured aws profile and region to update that prior to deployment run
`export AWS_DEFAULT_REGION=<your-region>`
`export AWS_PROFILE=<your-aws-profile>`

* `npx cdk doctor` - ensure the output AWS region and account match where you would like to deploy the application
* `npx cdk deploy` - deploy stack to configured aws account

## Testing

* `npm run test` - execute the jest tests
