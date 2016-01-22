Template.subscriptions.helpers({
  experiences: function() {
    return Experiences.find({'_id': {'$in': Meteor.user().profile.experiences}});
  }
});

Template.experience.helpers({
  subscribed: function() {
    return Meteor.user().profile.subscriptions.indexOf(this._id) != -1;
  }
});

Template.experience.events({
  'click .btn-subscribe': function (event) {
    let exps =  Meteor.user().profile.subscriptions;
    exps.push(this._id);
    Meteor.users.update(Meteor.userId(), {$set: {'profile.subscriptions': exps}});
    console.log(Meteor.user().profile.subscriptions);
  },
  'click .btn-unsubscribe': function (event) {
    let subs =  Meteor.user().profile.subscriptions;
    let i = subs.indexOf(this._id);
    if(i != -1) {
      subs.splice(i, 1);
    }
    Meteor.users.update(Meteor.userId(), {$set: {'profile.subscriptions': subs}});
    console.log(Meteor.user().profile.subscriptions);
  }
});
