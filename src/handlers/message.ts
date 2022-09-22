import Doc from "../entities/documents"
import { getApiGWManagementApi, sendMessageToClient, sendBroadcastMessage } from "../utils/aws";
import { getDocumentHandler, listDocumentsHandler, createDocumentHandler, deleteDocumentHandler, updateDocumentHandler } from "../handlers/documents"

export async function routingHandler (event, context, cb) {
    const connectionId = event.requestContext.connectionId
    const domainName = event.requestContext.domainName
    const stage = event.requestContext.stage
    const ApiGW = getApiGWManagementApi({ stage: stage, domain: domainName})

    try {
        const body = JSON.parse(event.body)
        const operation = body.operation
        switch (operation) {
            case "GET":
                if (body.documentId) {
                    getDocumentHandler(
                        body.documentId,
                        (document: Doc) => sendMessageToClient(connectionId, {'document': document}, ApiGW)
                    )
                }
                break;
            case "LIST":
                listDocumentsHandler(
                    (documents: Doc[]) => sendMessageToClient(connectionId, {'documents': documents}, ApiGW)
                )
                break;
            case "CREATE":
                if (body.document) {
                    const document = new Doc(body.document.name, body.document.content)
                    createDocumentHandler(
                        document,
                        (document) => sendBroadcastMessage({"operation": "CREATE", 'document': document}, ApiGW)
                    )
                }
                break;
            case "UPDATE":
                if (body.document) {
                    const document = new Doc(
                        body.document.name,
                        body.document.content,
                        body.document.documentId
                    )
                    updateDocumentHandler(
                        document,
                        (document) => sendBroadcastMessage({"operation": "UPDATE", 'document': document}, ApiGW)
                    )
                }
                break;
            case "DELETE":
                deleteDocumentHandler(
                    body.documentId,
                    (documentId) => sendBroadcastMessage({"operation": "DELETE", 'document': documentId}, ApiGW)
                )
                break;

            default: { 
                    console.log("INVALID OPERATION: \n" + JSON.stringify(body, null, 2));
                    break; 
                } 
        }
    } catch(e) {
        if (e instanceof SyntaxError) {
            console.log("ERROR: INVALID JSON")
            cb(null, {
                statusCode: 400,
                body: 'Message should be valid JSON!'
            });
            return
        }

        console.log(`INTERNAL SERVER ERROR: ${e.stack}`)
        cb(null, {
            statusCode: 500,
            body: e.stack,
        });
        return

    }

    cb(null, {
        statusCode: 200,
        body: 'Ack.'
    });
  };