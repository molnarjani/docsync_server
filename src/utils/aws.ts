import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk";
const util = require('util')


export const dynamodbClient = new DynamoDB.DocumentClient();
export const connectionTable: any = process.env.CONNECTION_TABLE;
export const documentsTable: any = process.env.DOCUMENTS_TABLE;


export const getApiGWManagementApi = ({ stage, domain }) => {
    /**
     * Construct an AWS ApiGW manager class
     */
    const endpoint = util.format(util.format('https://%s/%s', domain, stage));
    console.log('Endpoint: ', endpoint);
    const apiVersion = '2018-11-29';
    const apigatewaymanagementapi = new ApiGatewayManagementApi({
        apiVersion,
        endpoint,
    });
    return apigatewaymanagementapi;
};

export const sendBroadcastMessage = (payload, apigatewaymanagementapi) => {
    /**
     * Queries `connectionTable` for open connections,
     * then sends message with `payload` for each of them
     * using the AWS API GW api
     */
    const params = {
        TableName: connectionTable
    };

    console.log('broadcasting to all clients ', payload, params);

    const connections = dynamodbClient.scan(params, (error, result) => {
        if (error) {
            console.log('error', error);
        } else {
            console.log(result.Items)
            result.Items?.map(
                item => sendMessageToClient(item.connectionId, payload, apigatewaymanagementapi)
            )
        }
    })
};

export const sendMessageToClient = (connectionId, payload, apigatewaymanagementapi) => {
    /**
     * Sends a message to a single websocket connection
     */
    console.log('posting to ', connectionId, ' recieved  ', payload);
    return new Promise((resolve, reject) => {
        let postOptions = {
            ConnectionId: connectionId, // connectionId of the receiving ws-client
            Data: JSON.stringify(payload),
        };
        apigatewaymanagementapi.postToConnection(postOptions, (err, data) => {
            if (err) {
                console.log('err is', err);
                reject(err);
            }
            resolve(data);
        });
    });
};