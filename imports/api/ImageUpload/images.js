import { FS } from 'meteor/cfs:base-package';
import { gm } from 'meteor/cfs:graphicsmagick';
import {AUTH, CONFIG} from "../config";

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

var imageFullStore = new FS.Store.S3("images", {
  // region: "us-east-2",
  accessKeyId: AUTH.AWS_ACCESSKEY_ID,
  secretAccessKey: AUTH.AWS_SECRET_ACCESSKEY,
  bucket: AUTH.AWS_BUCKET_CFS,
  folder: (CONFIG.MODE === "local") ? "local/images" : "prod/images",
  transformWrite: addDimensionsAndOrient, //optional
});

var imageThumbStore = new FS.Store.S3("thumbs", {
  // region: "us-east-2",
  accessKeyId: AUTH.AWS_ACCESSKEY_ID,
  secretAccessKey: AUTH.AWS_SECRET_ACCESSKEY,
  bucket: AUTH.AWS_BUCKET_CFS,
  folder: (CONFIG.MODE === "local") ? "local/thumbs" : "prod/thumbs",
  transformWrite: createSquareThumb, //optional
});

var avatarStore = new FS.Store.S3("avatars", {
  // region: "us-east-2",
  accessKeyId: AUTH.AWS_ACCESSKEY_ID,
  secretAccessKey: AUTH.AWS_SECRET_ACCESSKEY,
  bucket: AUTH.AWS_BUCKET_CFS,
  folder: (CONFIG.MODE === "local") ? "local/avatars" : "prod/avatars",
  transformWrite: createSquareAvatarThumb, //optional
});

export const Images = new FS.Collection('images', {
  stores: [imageFullStore, imageThumbStore],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});

export const Avatars = new FS.Collection('avatars', {
  stores: [avatarStore],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});
