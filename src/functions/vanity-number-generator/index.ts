import { ConnectContactFlowEvent, Context, ConnectContactFlowCallback } from 'aws-lambda';
import { DynamoDB, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { generateVanityNumbers } from '@libs/vanity-number-generator';
import winston from 'winston';

// json logger used for cloudwatch logs
winston.configure({
  level: process.env.LOG_LEVEL ?? 'debug',
  format: winston.format.json(),
  defaultMeta: { service: 'vanity-converter-lambda' },
  transports: [new winston.transports.Console()],
});

export const handler = async (event: ConnectContactFlowEvent, ctx: Context, cb: ConnectContactFlowCallback) => {
  const callerNumber = event.Details.ContactData.CustomerEndpoint?.Address;
  winston.info('received connect contact flow event', { callerNumber });

  if (!callerNumber) {
    winston.error('received contact flow event with no valid customer phone number');
    cb('unable to determine your number, please wait while we connect you with an agent');
    return;
  }

  const dynamodb = new DynamoDB({});

  const vanityNumbers = generateVanityNumbers(callerNumber);
  winston.info('generated vanity numbers', { vanityNumbers });

  const dbItem = {
    phoneNumber: { S: callerNumber },
    vanityNumber1: { S: vanityNumbers[0] },
    vanityNumber2: { S: vanityNumbers[1] },
    vanityNumber3: { S: vanityNumbers[2] },
    vanityNumber4: { S: vanityNumbers[3] },
    vanityNumber5: { S: vanityNumbers[4] },
  };

  const putItemCommand = new PutItemCommand({
    TableName: process.env.VANITY_TABLE_NAME,
    Item: dbItem,
  });

  winston.debug('updating database with vanity number collection');
  const result = await dynamodb.send(putItemCommand);

  return vanityNumbers;
};
