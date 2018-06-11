import { FS } from 'meteor/cfs:base-package';
import { gm } from 'meteor/cfs:graphicsmagick';

const createSquareThumb = (fileObj, readStream, writeStream) => {
  const size = '400';
  gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('png').pipe(writeStream);
};

const addDimensionsAndOrient = (fileObj, readStream, writeStream) => {
  const transformer = gm(readStream, fileObj.name()).autoOrient();
  transformer.stream().pipe(writeStream);
  transformer.identify({ bufferStream: true }, FS.Utility.safeCallback((err, metadata) => {
    if (err) {
      // handle the error
    } else {
      const orientation = metadata.Orientation;
      const size = metadata.size;
      if (orientation == 'RightTop') {
        fileObj.update({ $set: { 'metadata.width': size.height, 'metadata.height': size.width } });
      } else {
        fileObj.update({ $set: { 'metadata.width': size.width, 'metadata.height': size.height } });
      }
    }
  }));
};

export const Images = new FS.Collection('images', {
  stores: [
    new FS.Store.GridFS('images', { transformWrite: addDimensionsAndOrient }),
    new FS.Store.GridFS('thumbs', { transformWrite: createSquareThumb })
  ],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});
