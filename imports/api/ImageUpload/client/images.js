import { FS } from 'meteor/cfs:base-package';
import { CONFIG } from "../../config";

if (CONFIG.CFS_STORAGE_ADAPTER === "gridfs") {
  console.log('Meteor CollectionFS using cfs:gridfs storage adapter');
  var imageFullStore = new FS.Store.GridFS('images');
  var imageThumbStore = new FS.Store.GridFS('thumbs');
  var avatarStore = new FS.Store.GridFS('avatars');
} else {
  console.log('Meteor CollectionFS using cfs:s3 storage adapter');
  var imageFullStore = new FS.Store.S3("images");
  var imageThumbStore = new FS.Store.S3("thumbs");
  var avatarStore = new FS.Store.S3("avatars");
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