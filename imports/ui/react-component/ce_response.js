import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Zoom,
} from "@mui/material";

import { useTracker } from "meteor/react-meteor-data";
import { Submissions } from "../../api/OCEManager/currentNeeds.js";
import { Experiences } from "../../api/OCEManager/OCEs/experiences.js";

//TODO: pass in the prompt itself
export const CEResponse = ({ ids }) => {
  eid = ids[0];
  iid = ids[1];
  console.log("in CEResponse");

  // const [zoom1, setZoom1] = useState(false);
  // const [zoom2, setZoom2] = useState(false);

  const toggle = (state, setState) => {
    if (state) {
      setState(false);
    } else {
      setState(true);
    }
  };

  const [subHandle, submissions] = useTracker(() => {
    const handle = Meteor.subscribe("submissions.all");
    return [handle, Submissions.find({}).fetch()];
  });

  const [userHandle, users] = useTracker(() => {
    const handle = Meteor.subscribe("users.all");
    return [handle, Meteor.users.find({}).fetch()];
  });

  const [expHandle, experiences] = useTracker(() => {
    const handle = Meteor.subscribe("experiences.all");
    return [handle, Experiences.find({}).fetch()];
  });

  if (subHandle.ready() && userHandle.ready() && expHandle.ready()) {
    const mySub = submissions.find(
      (s) => s.uid === Meteor.userId() && s.eid === eid
    );
    const myNeedNames = mySub.needName;
    const otherSubs = submissions.filter(
      (s) => myNeedNames.includes(s.needName) && s.uid !== Meteor.userId()
    )[0];

    const myImage = mySub.content.proof;
    const otherImages = otherSubs.content.proof;
    const friends = users.find((u) => u._id === otherSubs.uid);

    //to find information on the experience
    const experiencePrompt = experiences.find((e) => e._id === eid);
    console.log(experiencePrompt);

    results = {
      friendOneName: `${friends.profile.firstName} ${friends.profile.lastName}`,
      imageOne: otherImages,
      captionOne: otherSubs.content.sentence,
      myImage: myImage,
      myCaption: mySub.content.sentence,
      allUsers: users,
      promptName: experiencePrompt.name,
      promptQuestion: experiencePrompt.contributionTypes[0].toPass.situationDescription,
    };

    return (
      <div>
        <Accordion sx={{ border: "1px solid #2018b8", marginBottom: "5px" }}>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="h5">{results.promptName} Result - tap to expand!</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* <Typography variant="h5">
              {results.promptQuestion}
              <br /> <br />
            </Typography> */}
            <Card sx={{ display: "flex", flexDirection: "row"}}>
              {/* <Zoom
                in={zoom1}
                style={{ transitionDelay: zoom1 ? "500ms" : "0ms" }}
                onclick={() => toggle(zoom1, setZoom1)}
              > */}
              <CardMedia
                component="img"
                image={results.myImage}
                alt="bun bunz"
                sx={{ width: "50%" }}
              />
              {/* </Zoom> */}
              <CardContent>
                <Typography variant="body" color="text.secondary">
                  {results.myCaption} - You
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ display: "flex", flexDirection: "row" }}>
              <CardContent>
                <Typography variant="body" color="text.secondary">
                  {results.captionOne} - {results.friendOneName}
                </Typography>
              </CardContent>
              <CardMedia
                component="img"
                image={results.imageOne}
                alt="bun bunz"
                sx={{ width: "50%" }}
              />
            </Card>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  } else {
    console.log("loading submissions and users");
    return <div></div>;
  }
};
