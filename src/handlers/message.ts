module.exports.routingHandler = (event, context, cb) => {
    console.log("DEFAULT: \n" + JSON.stringify(event, null, 2));

    try {
        const body = JSON.parse(event.body)
        const operation = body.operation
        switch (operation) {
            case "GET":
                console.log("CREATE: \n" + JSON.stringify(body, null, 2));
                break;
            case "LIST":
                console.log("LIST: \n" + JSON.stringify(body, null, 2));
                break;
            case "CREATE":
                console.log("CREATE: \n" + JSON.stringify(body, null, 2));
                break;
            case "UPDATE":
                console.log("UPDATE: \n" + JSON.stringify(body, null, 2));
                break;
            case "DELETE":
                console.log("DELETE: \n" + JSON.stringify(body, null, 2));
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

        console.log(`INTERNAL SERVER ERROR: {e.stack}`)
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