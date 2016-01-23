Template.experienceCreator.events({
  'submit form': function(e) {
    e.preventDefault();
    let modules = [];
    let requirements = [];
    let email = '';
    let name = $(e.target).find('[name=name]').val();

    if ($('#photo').is(':checked')) {
      modules[0] = 'photo';
      email = '<p>Get your camera ready because it\'s time to post a picture for ' + name + '.';
      requirements[0] = 'hasCamera'
    } else {
      email = '<p>Get ready because it\'s time to participate in ' + name + '.'
    }

    let experience = {
      name: name,
      desc: $(e.target).find('[name=desc]').val(),
      author: Meteor.userId(),
      module: modules,
      start_email_text: email,
      requirements: requirements
    };

    experience._id = Experiences.insert(experience);

    email = email + ' Follow this <a href="http://localhost:3000/participate/' + experience._id + '">link</a></p>'
    console.log(email);
    Experiences.update({_id: experience._id}, {
        $set: {start_email_text: email}
    });

    Router.go('participatePage', experience);
  }
});
