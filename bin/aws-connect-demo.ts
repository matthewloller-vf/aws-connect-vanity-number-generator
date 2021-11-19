#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsConnectDemoStack } from '../lib/aws-connect-demo-stack';

const app = new cdk.App();
new AwsConnectDemoStack(app, 'AwsConnectDemoStack', {
  // enabling deployment to be determined by developer aws configuration
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  // env: { account: '508303515071', region: 'us-east-1' },
});
