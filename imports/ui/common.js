import {Template} from "meteor/templating";

Template.registerHelper('getImageById', (data, id) => {
  let image = data.images.find(function(x){
    return x._id === id;
  });

  return image;
});

Template.registerHelper('getUserById', (users, uid) => {
  return users.find(function (x) {
    return x._id === uid;
  });
});

Template.registerHelper('userAvatarImg', (avatars, user) => {
  let username = user.username;
  let email = user.emails[0].address;
  return avatars.find(function(avatar) {
    return (avatar.username == username) && (avatar.email == email);
  });
});
