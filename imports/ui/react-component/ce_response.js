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
import { getOtherUser } from "../../ui/pages/chat";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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

    const otherUid = getOtherUser();
    const otherSubs = submissions.filter(
      (s) => s.uid === otherUid && s.eid === eid
    );
    let mySub;
    let otherSub;
    for (let i = 0; i < otherSubs.length; i++){
      let tempSub = submissions.find(
        (s) => otherSubs[i].needName === s.needName && s.uid === Meteor.userId()
      );
      if (tempSub) {
        otherSub = otherSubs[i];
        mySub = tempSub;
      }
    }

    const myImage = mySub.content.proof;
    const otherImages = otherSub.content.proof;
    const friends = users.find((u) => u._id === otherUid);
    console.log("friends: ", friends)

    //to find information on the experience
    const experiencePrompt = experiences.find((e) => e._id === eid);
    console.log(experiencePrompt);

    results = {
      friendOneName: `${friends.profile.firstName} ${friends.profile.lastName}`,
      imageOne: otherImages,
      captionOne: otherSub.content.sentence,
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
              <TransformWrapper style={{width: "50%"}}>
               <TransformComponent>
                  <img src={results.myImage} alt="OCE result image 1"/>
              </TransformComponent>
              </TransformWrapper>
              {/* <CardMedia
                component="img"
                image={results.myImage}
                alt="OCE result image 1"
                sx={{ width: "50%" }}
              /> */}
              {/* </Zoom> */}
              <CardContent sx={{ width: "50%" }}>
                <Typography variant="body" color="text.secondary">
                  {results.myCaption} - You
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ display: "flex", flexDirection: "row" }}>
              <CardContent 
              sx={{ width: "50%" }}
              >
                <Typography variant="body" color="text.secondary">
                  {results.captionOne} - {results.friendOneName}
                </Typography>
              </CardContent>
              <TransformWrapper>
               <TransformComponent>
                  <img src={results.imageOne} alt="OCE result image 2"/>
              </TransformComponent>
              </TransformWrapper>
              {/* <CardMedia
                component="img"
                image={results.imageOne}
                alt="bun bunz"
                sx={{ width: "50%" }}
              /> */}
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
