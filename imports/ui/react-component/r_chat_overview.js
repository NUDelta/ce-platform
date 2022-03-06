import React from "react";
import {
List,
ListItemButton,
ListItemText
} from "@mui/material";

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
      let otherUsers = users.filter((s) => s._id !== Meteor.userId());

      const allUsers = otherUsers.map((s) => {
          const userObj = {
              "id": s._id,
              "name": s.username,
              "msg": "this is " + s.username
          }
        return userObj
      })
      console.log(allUsers)
      return (<div>
        <List>
            {allUsers.map((item) => {
          return <ListItemButton onClick={(e) => { buttonClicked(item.id) }}>
          <ListItemText
          primary= { item.name }
          secondary = { item.msg}
          >
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
