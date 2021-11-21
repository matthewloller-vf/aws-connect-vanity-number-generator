import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { VanityNumberGeneratorStack } from './vanity-number-generator-stack';

let template: Template;

beforeAll(() => {
  const app = new cdk.App();
  const stack = new VanityNumberGeneratorStack(app, 'MyTestStack');
  template = Template.fromStack(stack);
});

test('Vanity Number Generator Lambda Function Created', () => {
  template.hasResource('AWS::Lambda::Function', {});
});

test('Vanity Number Dynamodb Table Created', () => {
  template.hasResource('AWS::DynamoDB::Table', {});
});

// TODO: add testing for correct permissions on the lambda function to write to dynamodb
