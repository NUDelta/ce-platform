import { FS } from 'meteor/cfs:base-package';
import { gm } from 'meteor/cfs:graphicsmagick';

const createSquareThumb = (fileObj, readStream, writeStream) => {
  const size = '400';
  gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('png').pipe(writeStream);
};

const addDimensionsAndOrient = (fileObj, readStream, writeStream) => {
    const transformer = gm(readStream, fileObj.name()).autoOrient();
    transformer.stream().pipe(writeStream);
    transformer.size({ bufferStream: true }, FS.Utility.safeCallback((err, size) => {
      if (err) {
        // handle the error
      } else {
        // autoOrient settings don't seem to progress over, reverse
        // TODO: more clear solution? figure out how to edit meta?
        fileObj.update({ $set: { 'metadata.width': size.height, 'metadata.height': size.width } });
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
