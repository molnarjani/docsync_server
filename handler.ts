module.exports.default = (event, context, cb) => {
    cb(null, {
      statusCode: 200,
      body: 'default'
    });
  };