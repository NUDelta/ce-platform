Accounts.onCreateUser(function (options, user) {
  user.profile = user.profile || {};
  user.profile.experiences = [];
  user.profile.subscriptions = [];
  user.profile.qualifications = {};
  for(let qualification of CEQualifications) {
    user.profile.qualifications[qualification] = false;
  }
  return user;
});
