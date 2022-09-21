import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk";
const util = require('util')

const getApiGWManagementApi = ({ stage, domain }) => {
    const callbackUrlForAWS = util.format(util.format('https://%s/%s', domain, stage));
     let endpoint =
        process.env.NODE_ENV !== 'production' ?
        'http://localhost:3001' :
        callbackUrlForAWS;
    console.log('Endpoint: ', endpoint);
    const apiVersion = '2018-11-29';
    const apigatewaymanagementapi = new ApiGatewayManagementApi({
        apiVersion,
        endpoint,
    });
    return apigatewaymanagementapi;
};

const dynamodbClient = new DynamoDB.DocumentClient();
const connectionTable: any = process.env.CONNECTION_TABLE;

export { getApiGWManagementApi , dynamodbClient, connectionTable};