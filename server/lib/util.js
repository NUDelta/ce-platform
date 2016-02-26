Util = {
  _getBase64Data: (doc, callback) => {
    let buffer = new Buffer(0),
        readStream = doc.createReadStream();
    readStream.on('data', (chunk) => {
      buffer = Buffer.concat([ buffer, chunk ]);
    });
    readStream.on('error', (err) => {
      callback(err, null);
    });
    readStream.on('end', () => {
      callback(null, buffer.toString('base64'));
    });
  },
  getBase64Data: Meteor.wrapAsync(this._getBase64Data)
};

