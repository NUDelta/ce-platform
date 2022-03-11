// Imports needed for the callbacks
import { Incidents } from "./OCEs/experiences";
import { Submissions } from "./currentNeeds";
import {serverLog} from "../logs";
import {adminUpdates} from "./progressorHelper";
import { AUTH, CONFIG } from "../config";
// needed because a callback uses `notify`
import {notify} from "../OpportunisticCoordinator/server/noticationMethods";
import {addContribution, changeIncidentToPass} from "./OCEs/methods";
import { sendSystemMessage, postExpInChat } from '../Messages/methods';

// import needs for aws s3 image upload
// import { AWS } from 'aws-sdk';
// import { sharp } from 'sharp';
// import 'dotenv/config';
// require('dotenv').config({ path: `${process.env.PWD}/.env`});

const sharp = require('sharp');

let AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: AUTH.AWS_ACCESS_KEY_ID,
  secretAccessKey: AUTH.AWS_SECRET_ACCESS_KEY
});

const submissionsCursor = Submissions.find({});
const submissionsHandle = submissionsCursor.observe({
  //TODO: make it so we can check the submission when through completely first?
  //e.g. if a photo upload fails this will still run not matter what
  changed(submission, old) {
    serverLog.call({message: `Submissions DB Changed!`});
    serverLog.call({message: `${Object.keys(submission)}`});
    if(!(submission.uid === null)){
      adminUpdates(submission);
      runCallbacks(submission);
    }
  }
});
Meteor.methods({
  updateSubmission(submission) {
    updateSubmission(submission);
  },
  createInitialSubmission(submission) {
    createInitialSubmission(submission);
  },
  uploadImage(image, submission){
    uploadImage(image, submission);
  }
  // add image upload method
});

export const updateSubmission = function(submission) {
  Submissions.update(
    {
      eid: submission.eid,
      iid: submission.iid,
      needName: submission.needName,
      _id: submission._id,
    },
    {
      $set: {
        content: submission.content,
      }
    },
    (err) => {
      if (err) {
        console.log("submission not inserted", err);
      }
    }
  );
};

export const createInitialSubmission = function(submission) {
  Submissions.update(
    {
      eid: submission.eid,
      iid: submission.iid,
      needName: submission.needName,
      uid: null
    },
    {
      $set: {
        uid: submission.uid,
        content: submission.content,
        timestamp: submission.timestamp,
        lat: submission.lat,
        lng: submission.lng
      }
    },
    (err) => {
      if (err) {
        console.log("submission not inserted", err);
      }
    }
  );
};

export const uploadImage = function (picture, submissionObject){
  let cdnLink = "";
  uploadImagesToS3(picture, submissionObject.needName, submissionObject.uid).then((link) => {
    cdnLink = link;
    console.log(`callback after uploadImagesToS3: {link: ${link}, cdnLink: ${cdnLink}}`);
    submissionObject.content["proof"] = cdnLink;
    console.log("image has been uploaded");
    createInitialSubmission(submissionObject)
  });

}


const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint(AUTH.S3_ENDPOINT),
});;

  /**
   * Uploads an image to an S3 bucket with a specified key.
   * @param key string key to store image as.
   * @param buffer buffer of image data as png.
   * @return {Promise<ManagedUpload.SendData>}
   */
   const uploadToS3 = async function (key, buffer) {
    const uploadParams = {
      Bucket: AUTH.S3_BUCKET,
      ACL: "public-read",
      Key: key,
      Body: buffer,
      ContentType: "image/png",
    };

    return s3.upload(uploadParams).promise();
  };

  /**
   * decode base64 to an image file and upload the file to the bucket specified in .env.
   * @param {string} base64Data image file encoded with base64
   * @param {string} needName use needName and uid to generate file name
   * @param {string} uid use needName and uid to generate file name
   * @returns {string} CDN link to image that was uploaded to the bucket.
   */
const uploadImagesToS3 = async (base64Data, needName, uid) => {
    console.log("in upload image...")

    // keys for where files will live on S3
    const imgKeyPrefix = `${AUTH.S3_PREFIX}`;
    let cdnForImg = "";

    try {
      // parse and decode base64 into a buffer
      const uri = base64Data.split(';base64,').pop();
      // console.log(base64Data)
      const buffer = Buffer.from(uri, "base64");

      let filename = needName + "-" + uid;
      let processedImgKey = `${imgKeyPrefix}/${filename}.png`;

      const pngBuffer = await sharp(buffer)
      .rotate()
      .toFormat('png')
      .toBuffer();


      // upload example image to S3
      try {
        await uploadToS3(processedImgKey, pngBuffer);

        // if upload was successful, create a CDN link to add to airtable
        cdnForImg = `${AUTH.S3_CDN}/${processedImgKey}`;
        console.log(`inside uploadImagesToS3 {cdnForImg: ${cdnForImg}}`);
      } catch (error) {
        console.log(`Error in uploading profile photo: ${error}`);
      }
    } catch (error) {
      console.log(`Error in processing file: ${error}`);
    }

    return cdnForImg;
  };


//checks the triggers for the experience of the new submission and runs the appropriate callbacks 5
function runCallbacks(mostRecentSub) {
  // need `cb` since all the callbacks called in the eval references this manager
  let cb = new CallbackManager(mostRecentSub);

  let callbackArray = Incidents.findOne(mostRecentSub.iid).callbacks;

  _.forEach(callbackArray, callbackPair => {
    let trigger = callbackPair.trigger;
    let fun = callbackPair.function;
    if (eval(trigger)) {
      eval("(" + fun + "(" + JSON.stringify(mostRecentSub) + "))");
    }
  });
}

export const numUnfinishedNeeds = (iid, needName) => {
  return Submissions.find({
    iid: iid,
    needName: needName,
    uid: null
  }).count();
};

class CallbackManager {
  constructor(mostRecentSubmission) {
    this.submission = mostRecentSubmission;
  }

  //trigger used in callbacks: checks if the new sub was for the specified need
  newSubmission(needName) {
    if (needName === undefined) {
      return true;
    } else {
      return this.submission.needName === needName;
    }
  }

  //trigger used in callbacks: checks if the need is finished
  needFinished(needName) {
    return numUnfinishedNeeds(this.submission.iid, needName) === 0;
  }

  //trigger used in callbacks: checks if the experience is finished
  incidentFinished() {
    let count = Submissions.find({
      iid: this.submission.iid,
      uid: null
    }).count();
    return count === 0;
  }

  //trigger used in callbacks: returns number of submission for the need
  numberOfSubmissions(needName) {
    if (needName === undefined) {
      return Submissions.find({
        iid: this.submission.iid,
        uid: { $ne: null }
      }).count();
    } else {
      return Submissions.find({
        iid: this.submission.iid,
        needName: needName,
        uid: { $ne: null }
      }).count();
    }
  }

  //trigger used in callbacks: returns minutes since the first need was submitted. Additionally for this trigger, in runCallbacks we need to set a timer to run the function in the future
  timeSinceFirstSubmission(need) {
    return number; //minutes
  }
}
