import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB, ScanCommand } from '@aws-sdk/client-dynamodb';
import winston from 'winston';

// json logger used for cloudwatch logs
winston.configure({
  level: process.env.LOG_LEVEL ?? 'debug',
  format: winston.format.json(),
  defaultMeta: { service: 'vanity-number-viewer' },
  transports: [new winston.transports.Console()],
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  winston.debug('received api gateway event', event);

  const scanCommand = new ScanCommand({ TableName: process.env.VANITY_TABLE_NAME, Limit: 5 });

  try {
    const dynamodb = new DynamoDB({});
    var response = await dynamodb.send(scanCommand);
    winston.info(response);
    return {
      statusCode: 200,
      body: JSON.stringify({ items: response.Items }),
    };
  } catch (err) {
    winston.error('database error', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'failed to retrieve vanity number list' }),
    };
  }
};
