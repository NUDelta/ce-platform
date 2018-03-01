import { GoogleMaps } from 'meteor/dburles:google-maps';
import {Accounts} from "meteor/accounts-base";

Meteor.startup(() => {
  GoogleMaps.load({ key: 'AIzaSyA4LczQjd7IBHE0VV-WDRo0qkkGPQJBn6I' });

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });
});
