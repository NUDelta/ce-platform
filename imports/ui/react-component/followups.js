import React from "react";

function isNumeric(char) {
  return char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58; //numeric 0 - 9
  }

export const Followups = ({followup}) => {
  if (followup.includes("Woo-hoo!")) {
    let result = [];
    let question = "";
    for (let i = 0; i < followup.length; i++) {
      if (isNumeric(followup[i])) {
        result.push(question);
        question = followup[i];
      } else {
        question += followup[i];
      }
    }
    result.push(question);
    return (
      <div>
        {result.map((item) => {
          return <div>{item}</div>
        })}
      </div>);
  }

  return (<div>{followup}</div>);
};