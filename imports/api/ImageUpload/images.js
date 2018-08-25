import { FS } from 'meteor/cfs:base-package';
import { gm } from 'meteor/cfs:graphicsmagick';
import { AUTH } from "../config";

const createSquareThumb = (fileObj, readStream, writeStream) => {
  const size = '400';
  gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('png').pipe(writeStream);
};

const createSquareAvatarThumb = (fileObj, readStream, writeStream) => {
  const size = '96';
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

var avatarStore = new FS.Store.S3("avatars", {
  region: "us-east-2", //optional in most cases
  accessKeyId: AUTH.AWS_ACCESSKEY_ID,
  secretAccessKey: AUTH.AWS_SECRET_ACCESSKEY,
  bucket: "ce-platform-cfs", //required
  // ACL: "myValue", //optional, default is 'private', but you can allow public or secure access routed through your app URL
  folder: "avatars", //optional, which folder (key prefix) in the bucket to use
  // The rest are generic store options supported by all storage adapters
  transformWrite: createSquareAvatarThumb, //optional
  // transformRead: myTransformReadFunction, //optional
  // maxTries: 1 //optional, default 5
});

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

export const Avatars = new FS.Collection('avatars', {
  // stores: [new FS.Store.GridFS('avatars', { transformWrite: createSquareAvatarThumb })],
  stores: [avatarStore],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});
