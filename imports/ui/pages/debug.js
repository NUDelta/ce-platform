import './debug.js'

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Locations } from '../../api/locations/locations.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { ParticipationLocations } from '../../api/participation-locations/participation_locations.js';
import { updateLocation } from '../../api/locations/methods.js';

Template.debug.onCreated(function() {
  const users1 = Meteor.subscribe('all_users');
  console.log(Meteor.users.find());

});

Template.debug.helpers({
  userIds(){
    console.log(Meteor.users.findOne({_id: "YCksuDh5hub8858BS"}));
    return Meteor.users.findOne({_id: "YCksuDh5hub8858BS"});
  },
  locations(){
    return Locations.find();
  }

});

Template.debug.events({
  'click #clear_db'(event, instance){
    console.log("you clicked clear db");
    Meteor.call("cleardb", {}, (err, res) => {
      if (err) { console.log(err);}
    });
  },
  'click #add_users'(event, instance){
    console.log("you clicked add users");
    users.forEach(user => Meteor.call("addUsers", {user: user}));
    experiences.forEach(experience => Meteor.call("addExperience", {experience: experience}));


     //how to create user with out logging in?
  },
  'click #add_locations'(event, instance){
    Meteor.call('addLocations', {});
  },
  'submit form'(event, instance){
    event.preventDefault();
    console.log("updating a location");
    Meteor.call('updateLocationById', {id: event.target.id.value, lat:parseFloat(event.target.lat.value), long:parseFloat(event.target.long.value) });
  }
});

const users = [
  {
    email: 'a@gmail.com',
    password: 'password'
  },
  {
    email: 'b@gmail.com',
    password: 'password'
  },
  {
    email: 'c@gmail.com',
    password: 'password'
  },
  {
    email: 'd@gmail.com',
    password: 'password'
  },
  {
    email: 'e@gmail.com',
    password: 'password'
  },
  {
    email: 'f@gmail.com',
    password: 'password'
  },
]

const experiences = [
  {
    name: 'Telephone',
    author: "B5YpTavGbmrihS8jq",
    description: 'Come play an online telephone game with people across the world.',
    startText: 'Telephone is about to start!',
    modules: ['chain'],
    requirements: [],
    optIn: false,
  },
  {
    name: 'Storytime',
    author: "B5YpTavGbmrihS8jq",
    description: 'Let\'s all write a story together!',
    startText: 'Storytime is about to start!',
    modules: ['text'],
    requirements: [],
    optIn: false,
    affordance: ["sit"],
    custom_notification: 'require2users'
  },
  {
    name: 'Nightlight',
    author: "B5YpTavGbmrihS8jq",
    description: 'Shine your phone\'s flashlight into the night sky in solidarity with everyone walking in the dark',
    startText: 'Come be a part of Nightlight!',
    modules: ['map'],
    requirements: [],
    optIn: true,
    affordance: ["nighttime"]
  },
  {
    name: 'Stella Time',
    author: "B5YpTavGbmrihS8jq",
    description: 'We just want to play with Stella. Take a picture and tell a joke!',
    startText: 'Pet Stella now and take a picture!',
    modules: ['camera', 'text'],
    requirements: ['hasCamera'],
    optIn: false,
  },
  {
    name: 'Sunset',
    author: "B5YpTavGbmrihS8jq",
    description: 'Take a picture of the sunset!',
    startText: 'Take a picture of the sunset to help us make a timelapse video!',
    modules: ['camera'],
    requirements: ['hasCamera'],
    optIn: false,
    route: 'sunset',
    affordance: ['beach']
  },
  {
    name: 'Highfive!',
    author: "B5YpTavGbmrihS8jq",
    description: 'highfive anybody!',
    startText: 'You get a partner!',
    modules: ['text'],
    requirements: [],
    optIn: false,
    custom_notification: 'require2users'
  },
  {
    name: 'Cheers!',
    author: "B5YpTavGbmrihS8jq",
    description: 'cheers!',
    startText: 'cheers!',
    modules: ['camera'],
    requirements: ['hasCamera'],
    optIn: false,
    route: 'cheers'
  }
];
