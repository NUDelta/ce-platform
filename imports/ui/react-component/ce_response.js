import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';

import { useTracker } from 'meteor/react-meteor-data';
import { Submissions } from "../../api/OCEManager/currentNeeds.js";
import { Images } from '../../api/ImageUpload/images.js';

export const CEResponse = ({ ids }) => {
  eid = ids[0];
  iid = ids[1];
  console.log("in CEResponse");

  const [subHandle, submissions] = useTracker(() => {
    const handle = Meteor.subscribe('submissions.all');
    // while(!handle.ready()){
    //   console.log("loading submissions");
    // }
    // console.log(Submissions.find({}).fetch())
    return [handle, Submissions.find({}).fetch()];
  });

  const [imageHandle, images] = useTracker(() => {
    const handle = Meteor.subscribe('images.all');
    // while(!handle.ready()){
    //   console.log("loading images");
    // }
    return [handle, Images.find({}).fetch()];
  });

  const [userHandle, users] = useTracker(() => {
    const handle = Meteor.subscribe('users.all');
    // while(!handle.ready()){
    //   console.log("loading users");
    // }
    return [handle, Meteor.users.find({}).fetch()]
  });

  if (subHandle.ready() && imageHandle.ready() && userHandle.ready()) {
    console.log("handles are ready")
    const mySub = submissions.find(s => (s.uid === Meteor.userId() && s.eid === eid));
    console.log(mySub)
    const myNeedNames = mySub.needName;
    const otherSubs = submissions.filter(s => myNeedNames.includes(s.needName) && s.uid !== Meteor.userId());

    const myImage =  mySub.content.proof;
    // const myImage = images.find(i => i._id === mySub.content.proof);
    // const otherImages = otherSubs.map(s => images.find(i => i._id === s.content.proof));
    const otherImages =  otherSubs.content.proof;
    const friends = otherSubs.map(s => users.find(u => u._id === s.uid));

    results = {
      friendOneName: `${friends[0].profile.firstName} ${friends[0].profile.lastName}`,
      imageOne: otherImages,
      captionOne: otherSubs[0].content.sentence,
      myImage: myImage,
      myCaption: mySub.content.sentence,
      allUsers: users
    };
    // Object.assign(results,
    //   friends[0] && {friendOneName: `${friends[0].profile.firstName} ${friends[0].profile.lastName}`},
    //   {imageOne: otherImages[0]},
    //   otherSubs[0] && {captionOne: otherSubs[0].content.sentence},
    //   {myImage: myImage},
    //   mySub && {myCaption: mySub.content.sentence},
    //   {allUsers: users}
    // )
    console.log(results)
    return (
      <div>
        <Accordion>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <Typography>TODO: replace with experience</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              TODO: replace with given prompt<br /> <br />
            </Typography>
            <Card sx={{ display: "flex", flexDirection: "row" }}>
              <CardMedia
                component="img"
                image={ results.myImage.original.name }
                alt="bun bunz"
                sx={{ width: "50%" }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  { results.myCaption} - You
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ display: "flex", flexDirection: "row" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  { results.captionOne } - {results.friendOneName}
                </Typography>
              </CardContent>
              <CardMedia
                component="img"
                image= { results.imageOne.original.name}
                alt="bun bunz"
                sx={{ width: "50%" }}
              />
            </Card>
          </AccordionDetails>
        </Accordion>
      </div>
    );
    
  } else {
    console.log("loading submissions, images, and users")
    return <div></div>
  }
  
};