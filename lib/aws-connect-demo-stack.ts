import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as lambdaNode from '@aws-cdk/aws-lambda-nodejs';

export class AwsConnectDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vanityNumberTable = new dynamodb.Table(this, 'VanityNumbers', {
      partitionKey: { name: 'phoneNumber', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const vanityConverterLambda = new lambdaNode.NodejsFunction(this, 'vanity-converter-v1-lambda', {
      description: 'Receives a contact flow event and generates vanity numbers based on the caller phone number',
      entry: 'src/vanity-converter-lambda/index.ts',
      runtime: lambda.Runtime.NODEJS_14_X,
      timeout: cdk.Duration.seconds(10),
      bundling: { sourceMap: true, minify: true },
      environment: {
        VANITY_TABLE_NAME: vanityNumberTable.tableName,
      },
    });
    vanityNumberTable.grantReadWriteData(vanityConverterLambda);
  }
}
