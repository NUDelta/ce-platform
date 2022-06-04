import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";

export const Prompt = ({ promptList }) => {
    let buttons = [];
    for(let i = 0; i < promptList.length; i++) {
        buttons.push(
            <ToggleButton
            color="info"
                key={i}
                value={i}
                onClick={() => {
                    let promptContainer = document.getElementById("currentPrompt");
                    promptContainer.innerHTML = promptList[i];
                }}
            >
                {`Prompt ${i+1}`}
            </ToggleButton>
        );
    }
  return (
      <div>
    <ToggleButtonGroup
      color="info"
      exclusive
    >
        {buttons}
    </ToggleButtonGroup>
    <p id="currentPrompt" style={{marginTop:"10px"}}>{promptList[0]}</p>
    </div>
  );
}