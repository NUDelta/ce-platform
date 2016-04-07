import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Images } from './images.js';

let _getBase64Data = (doc, callback) => {
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
    experienceId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    picture: {
      type: String // base64 string?
    },
    title: {
      type: String,
      optional: true
    }
  }).validator(),
  run({ experienceId, picture, title = 'upload.png' }) {
    // title might throw an error
    let newFile = new FS.File();
    newFile.attachData(new Buffer(picture, 'base64'), { type: 'image/png' }, function(error) {
      if (error) throw error;

      newFile.name(title);
      let image = Images.insert(newFile);
      image = Images.findOne(image._id);
      Images.update({ _id: image._id }, {$set : { experience: experienceId }});
    });
    return picture;
  }
});

export const getPhotos = new ValidatedMethod({
  name: 'images.mobile.find',
  validate: new SimpleSchema({
    experienceId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),
  run({ experienceId }) {
    let pics = [];
    Images.find({experience: experienceId}).forEach((pic) => {
      pics.push(getBase64Data(pic));
    });
    return pics
  }
});