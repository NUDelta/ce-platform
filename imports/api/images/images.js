import { FS } from 'meteor/cfs:base-package';

export const Images = new FS.Collection('images', {
  stores: [new FS.Store.GridFS('images')]
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
