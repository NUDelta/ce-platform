import { GoogleMaps } from 'meteor/dburles:google-maps';
// import {Meteor} from "meteor/meteor";
import {serverLog} from "../../api/logs";


Meteor.startup(() => {
  console.log("this is loading");
  GoogleMaps.load({ key: 'AIzaSyA4LczQjd7IBHE0VV-WDRo0qkkGPQJBn6I' });

  // TODO(rlouie): Hacky Solution to White Screen of Death
  // @see https://github.com/meteor/meteor/issues/7018#issuecomment-301562610
  Session.set('global.started', true);
});
