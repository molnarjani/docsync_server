import * as mongoDB from "mongodb";
import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk";
import { createBrotliCompress } from "zlib";
const util = require('util')


const dynamodbClient = new DynamoDB.DocumentClient();
const connectionTable: any = process.env.CONNECTION_TABLE;
const documentsTable: any = process.env.DOCUMENTS_TABLE;


const getApiGWManagementApi = ({ stage, domain }) => {
    const endpoint = util.format(util.format('https://%s/%s', domain, stage));
    console.log('Endpoint: ', endpoint);
    const apiVersion = '2018-11-29';
    const apigatewaymanagementapi = new ApiGatewayManagementApi({
        apiVersion,
        endpoint,
    });
    return apigatewaymanagementapi;
};

const sendBroadcastMessage = (payload, apigatewaymanagementapi) => {
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

const sendMessageToClient = (connectionId, payload, apigatewaymanagementapi) => {
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




export { getApiGWManagementApi, sendMessageToClient, sendBroadcastMessage, dynamodbClient, connectionTable, documentsTable };