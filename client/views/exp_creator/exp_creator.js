Template.experienceCreator.events({
  'submit form': function(e) {
    e.preventDefault();
    let modules = [];
    let requirements = [];
    let email = '';
    let name = $(e.target).find('[name=name]').val();

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
      requirements: requirements
    };

    console.log(experience);

    experience._id = Experiences.insert(experience);

    email = email + ' Follow this <a href="http://localhost:3000/participate/' + experience._id + '">link</a></p>'
    console.log(email);
    Experiences.update({_id: experience._id}, {
        $set: {startEmailText: email}
    });

    Router.go('participatePage', experience);
  }
});
