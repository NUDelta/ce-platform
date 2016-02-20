Template.experienceCreator.helpers({
  settings: function() {
    return {
      position: Session.get("position"),
      limit: 6,
      rules: [
        {
          // token: '',
          collection: YelpCategories,
          field: 'title',
          matchAll: true,
          template: Template.categoryName
        }
      ]
    };
  }
});

Template.experienceCreator.events({
  'submit form': function(e) {
    e.preventDefault();
    let modules = [];
    let requirements = [];
    let email = '';
    let name = $(e.target).find('[name=name]').val();
    let location = e.target.location.value;

    if ($('#photo').is(':checked')) {
      console.log("I got here");
      modules[0] = 'camera';
      email = '<p>Get your camera ready because it\'s time to post a picture for ' + name + '.';
      requirements[0] = 'hasCamera'
    } else {
      email = '<p>Get ready because it\'s time to participate in ' + name + '.'
    }

    let experience = {
      name: name,
      description: $(e.target).find('[name=desc]').val(),
      author: Meteor.userId(),
      modules: modules,
      startEmailText: email,
      requirements: requirements,
      location: location
    };

    experience._id = Experiences.insert(experience);

    email = email + ' Follow this <a href="http://localhost:3000/participate/' + experience._id + '">link</a></p>'
    Experiences.update({_id: experience._id}, {
        $set: {startEmailText: email}
    });

    Router.go('participatePage', experience);
  }
});
