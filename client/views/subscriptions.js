Template.subscriptions.helpers({
  //look up all experiences, grab requirements, cross-check with user's profile
  //also research JavaScript filter
  experiences: function() {
    //return Experiences.find({'_id': {'$in': Meteor.user().profile.experiences}});
    let filtered = [];
    let userHasCam = Meteor.user().profile.hasCamera;
    let userHasDog = Meteor.user().profile.hasDog;

    let exps = Experiences.find().forEach((exp) => {
      let reqs = exp.requirements;

      if (reqs.indexOf('hasDog') !== -1 && reqs.indexOf('hasCamera') !== -1) {
        if (userHasDog && userHasCam) {
          filtered.push(exp);
        }
      } else if (reqs.indexOf('hasDog') !== -1 && userHasDog) {
        filtered.push(exp);
      } else if (reqs.indexOf('hasCamera') !== -1 && userHasCam) {
        filtered.push(exp);
      } else if (reqs.length === 0) {
        filtered.push(exp);
      }
    });

    return filtered;
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
    let exp_name = Experiences.findOne(this._id).name;
    alert(`You have successfully subscribed to ${exp_name}. You'll get an email with instructions when it's time to participate!`);
  },
  'click .btn-unsubscribe': function (event) {
    let subs =  Meteor.user().profile.subscriptions;
    let i = subs.indexOf(this._id);
    if(i != -1) {
      subs.splice(i, 1);
    }
    Meteor.users.update(Meteor.userId(), {$set: {'profile.subscriptions': subs}});
    console.log(Meteor.user().profile.subscriptions);
    alert(`Sorry to see you go. We'll collectively miss you very much! :(`);
  }
});
