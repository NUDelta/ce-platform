import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Cerebro } from '../cerebro/server/cerebro-server.js';
import { Images } from './images.js';
import { Schema } from '../schema.js';

const _getBase64Data = (doc, callback) => {
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
}, getBase64Data = Meteor.wrapAsync(_getBase64Data);

export const insertPhoto = new ValidatedMethod({
  name: 'images.mobile.insert',
  validate: new SimpleSchema({
    incidentId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    image: {
      type: String // base64 string?
    },
    location: {
      type: Schema.Location
    },
    caption: {
      type: String
    },
    title: {
      type: String,
      optional: true
    },
    tag : {
      type: String,
      optional: true
    }
  }).validator(),
  run({ incidentId, image, location, caption, title = 'upload.png' }) {
    const newFile = new FS.File();
    newFile.attachData(new Buffer(image, 'base64'), { type: 'image/png' }, (error) => {
      if (error) throw error;
      newFile.name(title);
      let image = Images.insert(newFile);
      image = Images.findOne(image._id);
      Images.update({ _id: image._id },
        {
          $set: {
            incidentId: incidentId,
            lat: location.lat,
            lng: location.lng,
            location: Cerebro.getSubmissionLocation(location.lat, location.lng),
            caption: caption
          }
        });
    });
  }
});

export const getPhotos = new ValidatedMethod({
  name: 'images.mobile.find',
  validate: new SimpleSchema({
    incidentId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({ incidentId }) {
    let pics = [];
    Images.find({ incidentId: incidentId }).forEach((pic) => {
      pics.push(getBase64Data(pic));
    });
    return pics
  }
});

export const getPhotosByPartition = new ValidatedMethod({
  name: 'images.findByPartition',
  validate: new SimpleSchema({
    incidentId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({ incidentId }) {
    let pics = [];
    Images.find({ incidentId: incidentId }).forEach((pic) => {
      pics[pic.partition_num].push(getBase64Data(pic));
    });
    return pics
  }
});
