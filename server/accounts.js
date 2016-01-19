Accounts.onCreateUser((options, user) => {
  if (user.profile == undefined) {
    user.profile = {};
  }
  user.profile.hasDog = false;
  user.profile.hasCamera = false;
  return user;
});
