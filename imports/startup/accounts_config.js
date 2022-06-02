import {Avatars} from "../api/ImageUpload/images";

const getImageFiles = () => {
  // @see `accounts_page.html` for file input
  let file_input = document.getElementById('profileImage');
  return file_input.files;
};

AccountsTemplates.configure({
  defaultLayoutType: 'blaze', //Optional, the default is 'blaze'
  defaultLayout: 'layout',
  defaultLayoutRegions: {},
  defaultContentRegion: 'main',
   // old parameters?
  showLabels: false,
  texts: {
    navSignIn: "Sign In / Join",
  },

  preSignUpHook: (password, info) => {
    // Try to upload photo
    imageFiles = getImageFiles();
    if (imageFiles.length === 1) {
      let picture = imageFiles[0];
      Avatars.insert(picture, (err, imageFile) => {
        if (err) {
          alert(err);
        } else {
          Avatars.update({_id: imageFile._id}, {
            $set: {
              'username': info.username,
              'email': info.email
            }
          }, (err, docs) => {
            if (err) {
              console.log('Failed to link profile Image with Meteor user profile');
            }
          });
        }
      })
    }

    info.profile.experiences = [];
    info.profile.subscriptions = [];
    info.profile.lastParticipated = null;
    info.profile.lastNotified = null;
    info.profile.pastIncidents = [];
    info.profile.staticAffordances = {};
  },
});

AccountsTemplates.removeField('password');

AccountsTemplates.addField({
  _id: 'username',
  type: 'text',
  displayName: "Username",
  placeholder: {
    signUp: "Pick a username"
  },
  required: true,
});

AccountsTemplates.addField({
  _id: 'firstName',
  type: 'text',
  displayName: "First name",
  placeholder: "First name",
  required: true,
});

AccountsTemplates.addField({
  _id: 'lastName',
  type: 'text',
  displayName: "Last name",
  placeholder: "Last name",
  required: true,
});

AccountsTemplates.addField({
  _id: 'password',
  type: 'password',
  placeholder: {
    signUp: "New password"
  },
  required: true,
  minLength: 6,
  errStr: 'Must be at least 6 characters',
});

AccountsTemplates.addField({
  _id: 'profileImage',
  type: 'text', // currently this type doesn't matter, the important part is that we have a field with a custom template
  displayName: 'Profile photo',
  template: 'profileImageUpload',
});
