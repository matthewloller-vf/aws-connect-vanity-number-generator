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
  template.hasResourceProperties('AWS::Lambda::Function', { FunctionName: 'vanity-number-generator' });
});

test('Vanity Number Viewer Lambda Function Created', () => {
  template.hasResourceProperties('AWS::Lambda::Function', { FunctionName: 'vanity-number-viewer' });
});

test('Vanity Number Dynamodb Table Created', () => {
  template.hasResourceProperties('AWS::DynamoDB::Table', { TableName: 'vanity-numbers' });
});

test('Vanity Number Viewer Rest Api Created', () => {
  template.hasResourceProperties('AWS::ApiGateway::RestApi', { Name: 'Vanity Number Viewer API V1' });
});

// TODO: add testing for correct permissions on the lambda function to write to dynamodb
