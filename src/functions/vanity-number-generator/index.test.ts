import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDB, PutItemCommand } from '@aws-sdk/client-dynamodb';
import contactFlowEventMock from './mock.json';
import { handler } from '.';
import { ConnectContactFlowEvent, Context } from 'aws-lambda';
import winston from 'winston';

winston.configure({ silent: true });

describe('Vanity Generator Lambda', () => {
  test('Success', async () => {
    // override dynamo db client and resolve the put item command successfully
    const dynamoDbMock = mockClient(DynamoDB);
    dynamoDbMock.on(PutItemCommand).resolves({});

    await handler(contactFlowEventMock as ConnectContactFlowEvent, {} as Context, (err, result) => {
      expect(err).toBeNull();
      expect(result).not.toBeNull();
    });
  });

  // in the case of database failure we still want to return the results to the caller but note the error in the logs
  test('Database Failure', async () => {
    // override dynamo db client and reject the put item command to invoke a failure
    const dynamoDbMock = mockClient(DynamoDB);
    dynamoDbMock.on(PutItemCommand).rejects({});

    await handler(contactFlowEventMock as ConnectContactFlowEvent, {} as Context, (err, result) => {
      expect(err).toBeNull();
      expect(result).not.toBeNull();
    });
  });
});
