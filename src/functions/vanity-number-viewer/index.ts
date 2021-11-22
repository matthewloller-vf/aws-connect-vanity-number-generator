import { APIGatewayProxyCallback, APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB, ScanCommand, ScanCommandOutput } from '@aws-sdk/client-dynamodb';
import winston from 'winston';
import cheerio from 'cheerio';
import { readFileSync } from 'fs';

// json logger used for cloudwatch logs
winston.configure({
  level: process.env.LOG_LEVEL ?? 'debug',
  format: winston.format.json(),
  defaultMeta: { service: 'vanity-number-viewer' },
  transports: [new winston.transports.Console()],
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  winston.debug('received api gateway event', event);

  const scanCommand = new ScanCommand({
    TableName: process.env.VANITY_TABLE_NAME,
  });

  try {
    const dynamodb = new DynamoDB({});
    var response = await dynamodb.send(scanCommand);

    response.Items?.sort((a, b) => parseInt(b.updated.N ?? '') - parseInt(a.updated.N ?? '')).slice(0, 5);

    const $ = cheerio.load(readFileSync('./index.html'));

    for (const item of response.Items ?? []) {
      $('#vanityNumberTable > tbody').append(
        `<tr>
            <td>${item.phoneNumber?.S}</td>
            <td>${item.vanityNumber1?.S}</td>
            <td>${item.vanityNumber2?.S}</td>
            <td>${item.vanityNumber3?.S}</td>
            <td>${item.vanityNumber4?.S}</td>
            <td>${item.vanityNumber5?.S}</td>
         </tr>`
      );
    }

    return {
      statusCode: 200,
      body: $.html(),
      headers: {
        'Content-Type': 'text/html',
      },
    };
  } catch (err) {
    winston.error('database error', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'failed to retrieve vanity number list' }),
    };
  }
};
