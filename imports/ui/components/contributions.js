 import { Template } from 'meteor/templating';
 import { Cookies } from 'meteor/mrt:cookies';
 import { Meteor } from 'meteor/meteor';
 import { Messages } from '../../api/messages/messages.js';

 //import '../../api/messages/server/methods.js';
 import moment from 'moment';
 import './contributions.html';


 Template.message.helpers({

  timestamp() {
    const sentTime = moment(this.createdAt);
    //if today, just show time, else if some other day, show date and time
    if (sentTime.isSame(new Date(), "day")) {
      return sentTime.format("h:mm a");
    }
    return sentTime.format("M/D/YY h:mm a");
  },

  getImage() {
    const theImage = (Images.findOne(this.imageID));
    console.log("theImage" + theImage._id);
    return theImage;
  }
  
});


 Template.chat.onCreated(function bodyOnCreated() {

  this.messagesSub = this.subscribe("messages"); //get messages
  
});

 Template.chat.onRendered(function bodyOnRendered() {

  const $messagesScroll = this.$('.messages-scroll');
  
  //this is used to auto-scroll to new messages whenever they come in
  
  let initialized = false;
  
  this.autorun(() => {
    if (this.messagesSub.ready()) {
      Messages.find({recipient: "all"}, { fields: { _id: 1 } }).fetch();
      Tracker.afterFlush(() => {
        //only auto-scroll if near the bottom already
        if (!initialized || Math.abs($messagesScroll[0].scrollHeight - $messagesScroll.scrollTop() - $messagesScroll.outerHeight()) < 200) {
          initialized = true;
          $messagesScroll.stop().animate({
            scrollTop: $messagesScroll[0].scrollHeight
          });
        }
      });
    }
  });
  
});

 Template.chat.helpers({
  //get messages from database that have a recipient of either all or uid
  messages() {
    const uid = Meteor.userId();
    console.log("uid: " + uid)
    // let m = async function() {return Messages.find({name: "Josh"}, { sort: { createdAt: 1 } })};
    // m.then((doc) => {});
    // return m
    return Messages.find({ recipient: { $in: ["all", uid] } }, { sort: { createdAt: 1 } }); //most recent at the bottom
    //return Messages.find({}, { sort: { createdAt: 1 } });
  },
  
  hideHint() {
    return (Cookie.get("hideHint")=="true"); //convert from string to boolean
  }
  
});

 Template.chat.events({

  //send message
  
  'submit #message'(event, instance) {

    event.preventDefault();
    
    const $el = $(event.currentTarget);
    const $input = $el.find('.message-input');

    //find the fileinput element?
    //const $images = $el.find('.fileinput');
    //find the first and only picture that's been added
    let picture;
    const uid = Meteor.userId();
    const data = { message: $input.val() };

  if (event.target.photo.files.length != 0) {
        
    picture = event.target.photo.files[0]

    const location = this.location ? this.location : {lat: null, lng: null};
    const iid = Router.current().params.iid;
    const needName = Router.current().params.needName;

    const user = Meteor.user().username;
    const timestamp = Date.now()

    const imageFile = Images.insert(picture, (err, imageFile) => {
        //this is a callback for after the image is inserted
        if (err) {
          alert(err);
        } else {
          //success branch of callback
          //add more info about the photo
          Images.update({ _id: imageFile._id }, {
            $set: {
              iid: iid,
              uid: uid,
              lat: location.lat,
              lng: location.lng,
              needName: needName,
            }
          }, (err, docs) => {
            if (err) {
              console.log('upload error,', err);
            } else {
            }
          });
          // TODO: setTimeout for automatically moving on if upload takes too long

          //watch to see when the image db has been updated, then go to results
          const cursor = Images.find(imageFile._id).observe({
            changed(newImage) {
              if (newImage.isUploaded()) {
                cursor.stop();
                Router.go(resultsUrl);
              }
            }
          });
        }
      });

    data.image = imageFile._id;
  }
  else {
    data.image = "";
  }

    // const $setChar = $el.find('.character');
    // const $chapter = $el.find('.chapter');
  


    //const userName = $setChar.text();

    let participant = Meteor.users.findOne({
      "_id": uid,
    })
    //const chapterID = $chapter.text();
    console.log("data: " + data);
    console.log("first name: " + participant.profile.firstName);
    //console.log("chapter: " + chapterID);
    
    data.name = uid;

    //data.role = ;
    //data.chapterID = chapterID;
    
    Meteor.call("sendMessage", data, (error, response) => {
      if (error) {
        alert(error.reason);
      } else {
        //Cookie.set("name", response.name);
        $input.val("");
      }
    }); 
  },

  /*playing with idea of having time passed be an event
  'time passed'(event, instance) {
    event.preventDefault();



    data.order = order
    Meteor.call("sendPrompt", data, (error, response) => {
      if (error) {
        alert(error.reason);
      } else {
        //Cookie.set("name", response.name);
        $input.val("");
      }
    });

  },
  */

  //send prompt function
  /*
  let uid = //however we get the user's id 
  data = //info we get from uid 
  
  */
  
  //hide hint in the top right corner

  'click .ready-button'(event, instance) {
    event.preventDefault();
    
    const $el = $(event.currentTarget);
  },
  
  'click .hide-hint-button'(event, instance) {

    //cookies only understand strings
    Cookie.set("hideHint", (Cookie.get("hideHint")=="true") ? "false" : "true");
    
  }

  
});