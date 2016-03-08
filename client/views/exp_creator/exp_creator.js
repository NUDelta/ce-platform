Template.experienceCreator.onCreated(function() {
});

Template.experienceCreator.onRendered(function() {
  Meteor.typeahead.inject();
});

Template.experienceCreator.helpers({
  categories: function() {
    return _.map(YelpCategories, category => category.title);
  }
});

Template.experienceCreator.events({
  'submit form': function(e) {
    e.preventDefault();
    let modules = [];
    let requirements = [];
    let email = '';
    let name = $(e.target).find('[name=name]').val();
    let location = _.find(YelpCategories, (category) => {
      return category.title == e.target.location.value;
    });

    if (location) {
      location = location.alias;
    } else {
      location = '';
    }

    if ($('#photo').is(':checked')) {
      modules.push('camera');
      email = 'Get your camera ready because it\'s time to post a picture for ' + name + '.';
      requirements[0] = 'hasCamera'
    } else {
      email = 'The ' + name + ' experience is starting. ' + $(e.target).find('[name=desc]').val();
    }

    if ($('#text-entry').is(':checked')) {
      modules.push('text');
    }

    let experience = {
      name: name,
      description: $(e.target).find('[name=desc]').val(),
      author: Meteor.userId(),
      modules: modules,
      startText: email,
      requirements: requirements,
      location: location
    };

    experience._id = Experiences.insert(experience, (err, res) => {
      if (err) {
        alert(err);
      } else {
        //email += ' Follow this <a href="http://localhost:3000/participate/' + experience._id + '">link</a></p>'
        Experiences.update({ _id: experience._id }, {
          $set: {startText: email}
        });
        Router.go('participatePage', experience);
      }
    });

  }
});
