import {b64toBlob} from "../ui/pages/api_custom";
import {Images} from "../api/ImageUpload/images";

AccountsTemplates.configure({
  defaultLayout: 'layout',
  preSignUpHook: (password, info) => {
    // Try to upload photo
    let file_input = document.getElementById('profileImage');
    let imageFiles = file_input.files;
    if (imageFiles.length === 1) {
      let picture = imageFiles[0];
      Images.insert(picture, (err, imageFile) => {
        if (err) {
          alert(err);
        } else {
          console.log('upload success')

          // FIXME(rlouie): client side updating of Meteor.users not allowed unless doing it with an _id selector
          // Meteor.users.update({ email: info.email, username: info.username }, {

          //   $set: {
          //     'profile.profileImage': imageFile._id
          //   }
          // }, (err, docs) => {
          //   if (err) {
          //     console.log('Failed to link profile Image with Meteor user profile');
          //   }
          // });
        }
      })
    }
  },
  onLogoutHook: () => {
    // AccountsTemplates.logout();
    // Router.go('/');
    console.log("logged out");
  },
});

// AccountsTemplates.removeField('email');
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
  // func: function(value) {
  //   // true means validation error!
  //   // false/null means no error
  //   return value.match(/[a-z]/i);
  // },
  // errStr: 'First name: Only letters (a-z) allowed!',
  // transform: function(value) {
  //    return value.charAt(0).toUpperCase() + value.slice(1);
  // },
});

AccountsTemplates.addField({
  _id: 'lastName',
  type: 'text',
  displayName: "Last name",
  placeholder: "Last name",
  required: true,
  // func: function(value) {
  //   // true means validation error!
  //   // false/null means no error
  //   return value.match(/[a-z]/i);
  // },
  // errStr: 'Last name: Only letters (a-z) allowed!',
  // transform: function(value) {
  //   return value.charAt(0).toUpperCase() + value.slice(1);
  // },
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
  // re: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
  // errStr: 'At least 1 digit, 1 lowercase and 1 uppercase',
});

AccountsTemplates.addField({
  _id: 'profileImage',
  type: 'url',
  displayName: 'Profile photo',
  template: 'profileImageUpload',
  // required: true,
});
