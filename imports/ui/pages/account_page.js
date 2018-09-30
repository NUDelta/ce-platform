import {photoUpload} from "./photoUploadHelpers";

Template.profileImageUpload.events({
  'change input[name=at-field-profileImage]'(event, target) {
    photoUpload(event);
  },
});

Template.unstyledAtNavButton.replaces('atNavButton');