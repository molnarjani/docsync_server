import moment from 'moment';
import { dynamodbClient, connectionTable } from '../utils/aws';

export async function handleConnection(event, context, cb) {
  console.log("CONNECT: \n" + JSON.stringify(event, null, 2));
  const connectionId = event.requestContext.connectionId;

  await dynamodbClient.put({
    TableName: connectionTable,
    Item: {
      connectionId,
      // expire 4 hours after connection
      ttl: moment(Date.now()).add(4, 'h').toDate(),
    }
  }).promise();

  cb(null, {
    statusCode: 200,
    body: 'Connected.'
  });
};

export async function handleDisconnection(event, context, cb) {
  console.log("DISCONNECT: \n" + JSON.stringify(event, null, 2));
  const connectionId = event.requestContext.connectionId;

  await dynamodbClient.delete({
    TableName: connectionTable,
    Key: { connectionId }
  }).promise();

  cb(null, {
    statusCode: 200,
    body: 'Disconnected.'
  });
};