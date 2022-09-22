import Doc from "../entities/documents"
import { documentsTable, dynamodbClient }  from "../utils/aws"

export function listDocumentsHandler(cb: Function) {
    const params = {
        TableName: documentsTable
    };

    dynamodbClient.scan(params, (error, result) => {
        if (error) {
            console.log('error', error);
        } else {
            const documents = result.Items?.map(
                item => new Doc(item.name, item.content, item.documentId)
            )
            cb(documents)
        }
    })
}

export function getDocumentHandler(documentId: string, cb: Function) {
    const params = {
        TableName: documentsTable,
        Key: {
            documentId,
        },
    };

    dynamodbClient.get(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
            cb(data.Item)
        }
      });
}

export async function createDocumentHandler(document: Doc, cb: Function) {
    const params = {
        TableName: documentsTable,
        Item: {
          ...document
        }
    };

    await dynamodbClient.put(params).promise();
    cb(document)
}

export async function deleteDocumentHandler(documentId: string, cb: Function) {
    var params = {
        TableName: documentsTable,
        Key: {
          documentId, 
        },
      }
      
    await dynamodbClient.delete(params).promise();
    cb(documentId)
}

export async function updateDocumentHandler(document: Doc, cb: Function) {
    const params = {
        TableName: documentsTable,
        Item: {
          ...document
        }
    };

    await dynamodbClient.put(params).promise();
    cb(document)
}