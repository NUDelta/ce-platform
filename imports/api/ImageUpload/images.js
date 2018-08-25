import { FS } from 'meteor/cfs:base-package';
import { gm } from 'meteor/cfs:graphicsmagick';
import {AUTH, CONFIG} from "../config";
import {serverLog} from "../logs";

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

if (CONFIG.CFS_STORAGE_ADAPTER === "gridfs") {
  serverLog.call({message: 'Meteor CollectionFS using cfs:gridfs storage adapter'});
  var imageFullStore = new FS.Store.GridFS('images', { transformWrite: addDimensionsAndOrient });
  var imageThumbStore = new FS.Store.GridFS('thumbs', { transformWrite: createSquareThumb });
  var avatarStore = new FS.Store.GridFS('avatars', { transformWrite: createSquareAvatarThumb });
} else {
  serverLog.call({message: 'Meteor CollectionFS using cfs:s3 storage adapter'});
  var imageFullStore = new FS.Store.S3("images", {
    region: CONFIG.AWS_REGION,
    accessKeyId: AUTH.AWS_ACCESSKEY_ID,
    secretAccessKey: AUTH.AWS_SECRET_ACCESSKEY,
    bucket: CONFIG.AWS_BUCKET_CFS,
    folder: (CONFIG.MODE === "local") ? "local" : "prod",
    transformWrite: addDimensionsAndOrient,
  });
  var imageThumbStore = new FS.Store.S3("thumbs", {
    region: CONFIG.AWS_REGION,
    accessKeyId: AUTH.AWS_ACCESSKEY_ID,
    secretAccessKey: AUTH.AWS_SECRET_ACCESSKEY,
    bucket: CONFIG.AWS_BUCKET_CFS,
    folder: (CONFIG.MODE === "local") ? "local" : "prod",
    transformWrite: createSquareThumb,
  });
  var avatarStore = new FS.Store.S3("avatars", {
    region: CONFIG.AWS_REGION,
    accessKeyId: AUTH.AWS_ACCESSKEY_ID,
    secretAccessKey: AUTH.AWS_SECRET_ACCESSKEY,
    bucket: CONFIG.AWS_BUCKET_CFS,
    folder: (CONFIG.MODE === "local") ? "local" : "prod",
    transformWrite: createSquareAvatarThumb,
  });
}

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
