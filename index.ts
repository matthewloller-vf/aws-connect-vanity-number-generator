#!/usr/bin/env node
import 'source-map-support/register';
import 'tsconfig-paths/register';
import * as cdk from '@aws-cdk/core';
import VanityNumberGeneratorStack from '@stacks/vanity-number-generator';

const app = new cdk.App();

new VanityNumberGeneratorStack(app, 'VanityNumberGenerator', {
  description: 'Vanity number generator resource stack',
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
