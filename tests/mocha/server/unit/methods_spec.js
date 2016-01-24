if (MochaWeb) {
  MochaWeb.testOnly(() => {
    describe('Meteor method tests', () => {
      it('gets the correct eligible user experiences', (done) => {
        let sacha = Meteor.users.findOne('sacha');
        Meteor.call('updateUserExperiences', sacha, (err, result) => {
          chai.expect(result.length).to.equal(1);
          chai.expect(result[0]).to.equal('dogsaregreat');
          done();
        });
      });

      it('gets multiple experiences if eligible', (done) => {
        let tom = Meteor.users.findOne('tom');
        Meteor.call('updateUserExperiences', tom, (error, result) => {
          chai.expect(result.length).to.equal(2);
          done();
        });
      });
    });
  });
}
