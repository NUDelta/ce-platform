import {Meteor} from "meteor/meteor";
import {Incidents} from "../../api/OCEManager/OCEs/experiences";
import {ParticipatingNow} from "../../api/OpportunisticCoordinator/databaseHelpers";
import {needIsAvailableToParticipateNow} from "../../api/OpportunisticCoordinator/strategizer";

export const stateUpdatePullUserFromParticipatingNow = () => {
  if (Meteor.userId() && Session.get('iid') && Session.get('needName')) {
    Meteor.call('pullUserFromParticipatingNow', {
      iid: Session.get('iid'),
      needName: Session.get('needName'),
      uid: Meteor.userId()
    });
    Session.set('iid', null);
    Session.set('needName', null);
    Session.set('renderWaiting', false);
    Router.go('/');
  }
};

export const checkParticipatingNow = () => {
  const params = Router.current().params;
  if (Incidents.find().count() && ParticipatingNow.find().count() && params.iid && params.needName) {
    Session.set('iid', params.iid);
    Session.set('needName', params.needName);

    const incident = Incidents.findOne({_id: params.iid});
    if (!incident) {
      console.log(`could not find incident for iid ${params.iid}`);
      return;
    }
    console.log('calling needIsAvailableToParticipateNow from api_custom.onCreated');
    try {
      let pn_avail = needIsAvailableToParticipateNow(incident, params.needName)
      if (pn_avail === null) {
        return;
      } else if (pn_avail === false) {
        Session.set('renderWaiting', true);
        return;
      }
    } catch (e) {
      console.log(e);
      return;
    }

    Meteor.call('pushUserIntoParticipatingNow', {
      iid: params.iid, needName: params.needName, uid: Meteor.userId()
    });
  }

};

/**
 * Code for detecting page visibility, and whether the document has gone hidden
 * Forked from...
 * https://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
 */

/**
 Registers the handler to the event for the given object.
 @param obj the object which will raise the event
 @param evType the event type: click, keypress, mouseover, ...
 @param fn the event handler function
 @param isCapturing set the event mode (true = capturing event, false = bubbling event)
 @return true if the event handler has been attached correctly
 */
export const addEvent = (obj, evType, fn, isCapturing) => {
  if (isCapturing==null) isCapturing=false;
  if (obj.addEventListener){
    // Firefox
    obj.addEventListener(evType, fn, isCapturing);
    return true;
  } else if (obj.attachEvent){
    // MSIE
    let r = obj.attachEvent('on'+evType, fn);
    return r;
  } else {
    return false;
  }
};

// register to the potential page visibility change
addEvent(document, "potentialvisilitychange", function(event) {
  // TODO(rlouie): not sure of this if-else (whether both branches are reached)
  if (document.potentialHidden) {
    stateUpdatePullUserFromParticipatingNow();
  }
  else {
    checkParticipatingNow();
  }
});

// register to the W3C Page Visibility API
let hidden=null;
let visibilityChange=null;
if (typeof document.mozHidden !== "undefined") {
  hidden="mozHidden";
  visibilityChange="mozvisibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden="msHidden";
  visibilityChange="msvisibilitychange";
} else if (typeof document.webkitHidden!=="undefined") {
  hidden="webkitHidden";
  visibilityChange="webkitvisibilitychange";
} else if (typeof document.hidden !=="hidden") {
  hidden="hidden";
  visibilityChange="visibilitychange";
}
if (hidden!=null && visibilityChange!=null) {
  addEvent(document, visibilityChange, function(event) {
    // TODO(rlouie): not sure of this if-else (whether both branches are reached)
    if (hidden) {
      stateUpdatePullUserFromParticipatingNow();
    } else {
      checkParticipatingNow();
    }
  });
}


let potentialPageVisibility = {
  pageVisibilityChangeThreshold:3*3600, // in seconds
  init:function() {
    function setAsNotHidden() {
      let dispatchEventRequired=document.potentialHidden;
      document.potentialHidden=false;
      document.potentiallyHiddenSince=0;
      if (dispatchEventRequired) dispatchPageVisibilityChangeEvent();
    }

    function initPotentiallyHiddenDetection() {
      if (!hasFocusLocal) {
        // the window does not has the focus => check for  user activity in the window
        lastActionDate=new Date();
        if (timeoutHandler!=null) {
          clearTimeout(timeoutHandler);
        }
        timeoutHandler = setTimeout(checkPageVisibility, potentialPageVisibility.pageVisibilityChangeThreshold*1000+100); // +100 ms to avoid rounding issues under Firefox
      }
    }

    function dispatchPageVisibilityChangeEvent() {
      var unifiedVisilityChangeEventDispatchAllowed=false;
      let evt = document.createEvent("Event");
      evt.initEvent("potentialvisilitychange", true, true);
      document.dispatchEvent(evt);
    }

    function checkPageVisibility() {
      let potentialHiddenDuration=(hasFocusLocal || lastActionDate==null?0:Math.floor((new Date().getTime()-lastActionDate.getTime())/1000));
      document.potentiallyHiddenSince=potentialHiddenDuration;
      if (potentialHiddenDuration>=potentialPageVisibility.pageVisibilityChangeThreshold && !document.potentialHidden) {
        // page visibility change threshold raiched => raise the even
        document.potentialHidden=true;
        dispatchPageVisibilityChangeEvent();
      }
    }

    let lastActionDate=null;
    let hasFocusLocal=true;
    let hasMouseOver=true;
    document.potentialHidden=false;
    document.potentiallyHiddenSince=0;
    let timeoutHandler = null;

    addEvent(document, "pageshow", function(event) {
      // TODO(rlouie): not sure if this is relevant, since on pageshow, we are back on the home page
      checkParticipatingNow();
    });
    addEvent(document, "pagehide", function(event) {
      stateUpdatePullUserFromParticipatingNow();
    });
    addEvent(window, "pageshow", function(event) {
      // TODO(rlouie): not sure if this is relevant, since on pageshow, we are back on the home page
      checkParticipatingNow();
    });
    addEvent(window, "pagehide", function(event) {
      stateUpdatePullUserFromParticipatingNow();
    });
    addEvent(document, "mousemove", function(event) {
      lastActionDate=new Date();
    });
    addEvent(document, "mouseover", function(event) {
      hasMouseOver=true;
      setAsNotHidden();
    });
    addEvent(document, "mouseout", function(event) {
      hasMouseOver=false;
      initPotentiallyHiddenDetection();
    });
    addEvent(window, "blur", function(event) {
      hasFocusLocal=false;
      initPotentiallyHiddenDetection();
    });
    addEvent(window, "focus", function(event) {
      hasFocusLocal=true;
      setAsNotHidden();
    });
    setAsNotHidden();
  }
};

potentialPageVisibility.pageVisibilityChangeThreshold=4; // 4 seconds for testing
potentialPageVisibility.init();