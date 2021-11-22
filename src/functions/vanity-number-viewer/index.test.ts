import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDB, ScanCommand } from '@aws-sdk/client-dynamodb';
import apiGatewayProxyEvent from './mock.json';
import { handler } from '.';
import { APIGatewayProxyEvent } from 'aws-lambda';
import winston from 'winston';

winston.configure({ silent: true });

describe('Vanity Generator Viewer', () => {
  test('Success', async () => {
    // override dynamo db client and resolve the put item command successfully
    const dynamoDbMock = mockClient(DynamoDB);
    dynamoDbMock.on(ScanCommand).resolves({});

    const response = await handler(apiGatewayProxyEvent as any as APIGatewayProxyEvent);

    expect(response.statusCode).toBe(200);
  });

  // in the case of database failure we still want to return the results to the caller but note the error in the logs
  test('Database Failure', async () => {
    // override dynamo db client and reject the put item command to invoke a failure
    const dynamoDbMock = mockClient(DynamoDB);
    dynamoDbMock.on(ScanCommand).rejects({});

    const response = await handler(apiGatewayProxyEvent as any as APIGatewayProxyEvent);

    expect(response.statusCode).toBe(400);
  });
});
