Template.experienceCreator.events({
  'submit form': function(e) {
    e.preventDefault();
    let modules = [];
    let email = '';
    let name = $(e.target).find('[name=name]').val();

    if ($('#photo').is(':checked')) {
      console.log('yes');
      modules[0] = 'photo';
      email = '<p>Get your camera ready because it\'s time to post a picture for ' + name + '.'
    }

    let experience = {
      name: name,
      desc: $(e.target).find('[name=desc]').val(),
      author: Meteor.userId(),
      module: modules,
      start_email_text: email
    };

    experience._id = Experiences.insert(experience);

    //email = email + ' Follow this <a href="localhost:3000/participate/' + experience._id + '>link</a></p>'
    //Experiences.update(experience._id, {
        //$set: {start_email_text: email, module: modules}
    //});

    Router.go('participatePage', experience);
  }
});
