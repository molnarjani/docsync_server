module.exports.handleConnection = (event, context, cb) => {
  cb(null, {
    statusCode: 200,
    body: 'Connected.'
  });
};

module.exports.handleDisconnection = (event, context, cb) => {
  cb(null, {
    statusCode: 200,
    body: 'Disconnected.'
  });
};