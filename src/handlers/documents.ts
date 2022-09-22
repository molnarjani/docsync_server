import Doc from "../entities/documents"
import { documentsTable, dynamodbClient }  from "../utils/aws"

export function listDocumentsHandler(cb: Function) {
    /**
     * Lists all documents
     * 
     * TODO: support pagination
     */
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
    /**
     * Gets a single document by `documentId`
     */
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
    /**
     * Creates a document
     * Create event is broadcasted so clients can react
     * https://github.com/molnarjani/docsync_server#broadcast-events
     */
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
    /**
     * Deletes a document by `documentId`
     * Delete event is broadcasted so clients can react
     * https://github.com/molnarjani/docsync_server#broadcast-events
     */
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
    /**
     * Updated a document if `documentId` exists, otherwise created the document.
     * Update event is broadcasted so clients can react
     * https://github.com/molnarjani/docsync_server#broadcast-events
     */
    const params = {
        TableName: documentsTable,
        Item: {
          ...document
        }
    };

    await dynamodbClient.put(params).promise();
    cb(document)
}