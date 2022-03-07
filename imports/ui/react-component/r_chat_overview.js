import React from "react";
import {
List,
ListItemButton,
ListItemText,
ListItemIcon,
Typography
} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useTracker } from "meteor/react-meteor-data";

import { Router } from 'meteor/iron:router';

export const ChatOverview = () => {

const buttonClicked = (id) => {

 console.log(`clicked on user ${id}` )
 const myId = Meteor.userId();
 Router.go(`/chat/${id}`)

 }

 const [userHandle, users] = useTracker(() => {
    const handle = Meteor.subscribe("users.all");
    return [handle, Meteor.users.find({}).fetch()];
  });

  if (userHandle.ready()){
      let otherUsers = users.filter((s) => (s._id !== Meteor.userId() && s.username !== "cindy" && s.username !== "yvan"));

      otherUsers = otherUsers.map((s) => {
          const userObj = {
              "id": s._id,
              "name": s.username.charAt(0).toUpperCase() + s.username.slice(1),
          }
        return userObj
      })
     
      return (<div>
        <List>
            {otherUsers.map((item) => {
          return <ListItemButton sx={{ borderBottom: "1px solid #A9A9A9" }} onClick={(e) => { buttonClicked(item.id) }}>
          <ListItemIcon>
                <AccountCircleIcon fontSize="large" />
              </ListItemIcon>
          <ListItemText 
        //   primary= { item.name }
          >
          <Typography variant="h5">{ item.name }</Typography>
          </ListItemText>
          </ListItemButton>
      })}
            </List>
        </div>);
  } else {
      return <div></div>
  }
  

//   const chatExample = [
//     {
//         "id": "oEbsTi4v5aSm2mqm3",
//         "msg": "this comes second",
//         "timestamp": 2
//     }, {
//       "id": "8oLzixLdDCswGavn7",
//       "msg": "this comes first",
//       "timestamp": 1
//   }, {
//       "id": "pArYDf5KNNxvH3xv3",
//       "msg": "this comes last",
//       "timestamp": 3
//   }
// ]



};
