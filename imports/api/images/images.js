import { FS } from 'meteor/cfs:base-package';
import { gm } from 'meteor/cfs:graphicsmagick';

const createSquareThumb = (fileObj, readStream, writeStream) => {
  const size = '400';
  gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('png').pipe(writeStream);
};

const addDimensions = (fileObj, readStream, writeStream) => {
    readStream.pipe(writeStream);
    const transformer = gm(readStream, fileObj.name());
    transformer.size({ bufferStream: true }, FS.Utility.safeCallback((err, size) => {
      if (err) {
        // handle the error
      } else {
        fileObj.update({ $set: { 'metadata.width': size.width, 'metadata.height': size.height } });
      }
    }));
};

export const Images = new FS.Collection('images', {
  stores: [
    new FS.Store.GridFS('images', { transformWrite: addDimensions }),
    new FS.Store.GridFS('thumbs', { transformWrite: createSquareThumb })
  ],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});

/*
Expected metadata:
  {
    experienceId: experienceId,
    caption: caption,
    incidentId: incidentId,
    lat: location.lat,
    lng: location.lng,
    location: place
  }
 */
