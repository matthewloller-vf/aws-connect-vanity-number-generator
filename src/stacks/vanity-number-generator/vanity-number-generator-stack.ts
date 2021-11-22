import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as lambdaNode from '@aws-cdk/aws-lambda-nodejs';
import * as apigateway from '@aws-cdk/aws-apigateway';

export class VanityNumberGeneratorStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vanityNumberTable = new dynamodb.Table(this, 'VanityNumberDynamodbTable', {
      tableName: 'vanity-numbers',
      partitionKey: { name: 'phoneNumber', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'updated', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const vanityConverterLambda = new lambdaNode.NodejsFunction(this, 'VanityNumberGeneratorLambda', {
      functionName: 'vanity-number-generator',
      description: 'Receives a contact flow event and generates vanity numbers based on the caller phone number',
      entry: 'src/functions/vanity-number-generator/index.ts',
      runtime: lambda.Runtime.NODEJS_14_X,
      timeout: cdk.Duration.seconds(10),
      bundling: { sourceMap: true, minify: true },
      environment: {
        VANITY_TABLE_NAME: vanityNumberTable.tableName,
        LOG_LEVEL: 'debug', // this should be determined by environment
      },
    });
    vanityNumberTable.grantReadWriteData(vanityConverterLambda);

    const vanityNumberViewLambda = new lambdaNode.NodejsFunction(this, 'VanityNumberViewerLambda', {
      functionName: 'vanity-number-viewer',
      description: 'Receives an api gateway event and generates an html response with a vanity number table',
      entry: 'src/functions/vanity-number-viewer/index.ts',
      runtime: lambda.Runtime.NODEJS_14_X,
      timeout: cdk.Duration.seconds(10),
      bundling: { sourceMap: true, minify: true },
      role: undefined,
      environment: {
        VANITY_TABLE_NAME: vanityNumberTable.tableName,
        LOG_LEVEL: 'debug', // this should be determined by environment
      },
    });
    vanityNumberTable.grantReadData(vanityNumberViewLambda);

    const api = new apigateway.LambdaRestApi(this, 'VanityNumberViewerApi', {
      handler: vanityNumberViewLambda,
      restApiName: 'Vanity Number Viewer API V1',
      description: 'Returns the last 5 vanity number lists generated',
      proxy: false,
      deployOptions: {
        stageName: 'dev',
      },
    });

    const vanityNumberTableResourcePath = api.root.addResource('vanity-numbers');
    vanityNumberTableResourcePath.addMethod('GET');
  }
}
