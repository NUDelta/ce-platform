
import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


//TODO: pass in the prompt itself
export const CEResponseChat = ({ expInChat }) => {

  const messageStyle = {
    padding: "4px 12px",
    borderRadius:"10px",
    marginBottom: "4px"
  }

  const senderStyle = {
    alignSelf: "flex-end",
    background: "#2018b8",
    color: "white",
    padding: "4px 12px",
    borderRadius:"10px",
    marginBottom: "4px",
    maxWidth: "60%"
  }

  const recipientStyle = {
    alignSelf: "flex-start",
    background: "#dedede",
    padding: "4px 12px",
    borderRadius:"10px",
    marginBottom: "4px",
    maxWidth: "60%"
  }
  console.log(expInChat);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column"
    }}>
    {expInChat.map((exp) => {
      let expStyle;
      if(Meteor.userId() === exp.uid) {
        expStyle = senderStyle;
      } else {
        expStyle = recipientStyle;
      }
      let sentTime = moment(exp.time);
      sentTime = sentTime.format("M/D/YY");
      return <div style={expStyle}>
        <div style={{fontSize: "10px"}}>
          <span>{exp.name} </span>
          <span>{sentTime}</span>
        </div>
        <div>
        <TransformWrapper>
          <TransformComponent>
               <img src={exp.image} alt="submission image"></img>
          </TransformComponent>
        </TransformWrapper>
        </div>
        <div style={{fontSize: "12px"}}>
          <span>
          {exp.text}
          </span>
        </div>
      </div>
    })}
    </div>
  )
  // <div>
  //  <div class={{getSenderAndSetClass this.uid this.system}}>
  //       <div style="font-size: 10px;">
  //         <span>
  //           <b>{{getUsername this.uid}}</b>
  //         </span>
  //         <span>
  //           {{#let t = (timestamp this.createdAt)}}
  //             {{t}}
  //           {{/let}}
  //         </span>
  //       </div>
  //       <div>
  //         {{#if this.isReply}}
  //           {{#if isReceiver this}}
  //             <div style="font-style: italic; font-size: 12px;">Replied to your experience: </div>
  //           {{else}}
  //             <div style="font-style: italic; font-size: 12px;">Replied to {{getUsername this.replyRecipient}}'s experience: </div>
  //           {{/if}}
  //         {{/if}}
  //         {{this.message}}
  //       </div>
  //     </div>

  // </div>;
};


// const response = `<div class={{getSenderAndSetClass this.uid this.system}}>
// <div style="font-size: 10px;">
//   <span>
//     <b>{{getUsername this.uid}}</b>
//   </span>
//   <span>
//     {{#let t = (timestamp this.createdAt)}}
//       {{t}}
//     {{/let}}
//   </span>
// </div>
// <div>
//   {{#if this.isReply}}
//     {{#if isReceiver this}}
//       <div style="font-style: italic; font-size: 12px;">Replied to your experience: </div>
//     {{else}}
//       <div style="font-style: italic; font-size: 12px;">Replied to {{getUsername this.replyRecipient}}'s experience: </div>
//     {{/if}}
//   {{/if}}
//   {{this.message}}
// </div>
// </div>`