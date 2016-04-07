import { FS } from 'meteor/cfs:base-package';

export const Images = new FS.Collection('images', {
  stores: [new FS.Store.GridFS('images')]
});
