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

export const CEResponse = ({ ids }) => {
  eid = ids[0];
  iid = ids[1];
  console.log("in CEResponse");

  const [subHandle, submissions] = useTracker(() => {
    const handle = Meteor.subscribe('submissions.all');
    return [handle, Submissions.find({}).fetch()];
  });

  const [userHandle, users] = useTracker(() => {
    const handle = Meteor.subscribe('users.all');
    return [handle, Meteor.users.find({}).fetch()]
  });

  if (subHandle.ready() && userHandle.ready()) {
    const mySub = submissions.find(s => (s.uid === Meteor.userId() && s.eid === eid));
    const myNeedNames = mySub.needName;
    const otherSubs = submissions.filter(s => myNeedNames.includes(s.needName) && s.uid !== Meteor.userId())[0];

    const myImage =  mySub.content.proof;
    const otherImages =  otherSubs.content.proof;
    const friends = users.find(u => u._id === otherSubs.uid);

    results = {
      friendOneName: `${friends.profile.firstName} ${friends.profile.lastName}`,
      imageOne: otherImages,
      captionOne: otherSubs.content.sentence,
      myImage: myImage,
      myCaption: mySub.content.sentence,
      allUsers: users
    };
  
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
                image={ results.myImage }
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
                image= { results.imageOne}
                alt="bun bunz"
                sx={{ width: "50%" }}
              />
            </Card>
          </AccordionDetails>
        </Accordion> 
      </div>
    );
    
  } else {
    console.log("loading submissions and users")
    return <div></div>
  }
  
};