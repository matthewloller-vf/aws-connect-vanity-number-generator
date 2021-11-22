import { ConnectContactFlowEvent, Context, ConnectContactFlowCallback } from 'aws-lambda';
import { DynamoDB, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { generateVanityNumbers } from '@libs/vanity-number-generator-utils';
import moment from 'moment';
import winston from 'winston';

// json logger used for cloudwatch logs
winston.configure({
  level: process.env.LOG_LEVEL ?? 'debug',
  format: winston.format.json(),
  defaultMeta: { service: 'vanity-converter-lambda' },
  transports: [new winston.transports.Console()],
});

export const handler = async (event: ConnectContactFlowEvent, ctx: Context, cb: ConnectContactFlowCallback) => {
  winston.debug('received connect contact flow event', event);
  const callerNumber = event.Details.ContactData.CustomerEndpoint?.Address ?? '';

  if (!callerNumber) {
    winston.error('received contact flow event with no valid customer phone number');
    cb('unable to determine your number, please wait while we connect you with an agent');
    return;
  }

  const vanityNumbers = generateVanityNumbers(callerNumber);
  winston.info('generated vanity numbers', { vanityNumbers });

  const dbVanityNumbers = vanityNumbers.reduce((a, v, i) => ({ ...a, [`vanityNumber${i + 1}`]: { S: v } }), {});

  const dbItem = {
    phoneNumber: { S: callerNumber },
    updated: { N: moment().unix().toString() },
    ...dbVanityNumbers,
  };

  const putItemCommand = new PutItemCommand({ TableName: process.env.VANITY_TABLE_NAME, Item: dbItem });

  winston.debug('updating database with vanity number collection');

  try {
    const dynamodb = new DynamoDB({});
    await dynamodb.send(putItemCommand);
  } catch (err) {
    winston.error('database error', err);
  }

  const resultVanityNumbers = vanityNumbers.reduce((a, v, i) => ({ ...a, [`vanityNumber${i + 1}`]: v }), {});

  cb(null, resultVanityNumbers);
};
