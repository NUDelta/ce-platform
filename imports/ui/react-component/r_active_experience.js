import React from 'react';
import Button from '@mui/material/Button';
 
import '../stylesheets/layout.scss';

export const RActiveExperience = ({allExperience}) => {
    let waitingSubmissionBlock;
    if (allExperience[0].length > 0) {
        let waitingSubmission = mapExperience(allExperience[0], true)
        waitingSubmissionBlock = 
        <div>
            <h3><b>Here's what your partner already submitted!</b></h3>
            <h5>Don't leave your partner hanging! Won't be at the location in the next few days? Share a picture from your photo library instead!</h5>
            {waitingSubmission} 
        </div>
    }
    let rest = 
        <div>
            <h4>Available Experiences</h4>
            {mapExperience(allExperience[1], false)}
        </div>
    return (
        <div>
            {waitingSubmissionBlock}
            {rest}
        </div> 
    )
    }


const mapExperience = (experiences, isRed) => {
    return experiences.map((experience) => {
        let exp = experience.experience
        let iid = experience.iid
        let detectorUniqueKey = experience.detectorUniqueKey;
        let cardStyle;
        if (isRed) {
            cardStyle = {borderRadius: '1px', padding: '0px', backgroundColor:"LightPink"};
        } else {
            cardStyle = {borderRadius: '1px', padding: '0px'};
        }
        return(
            <div className="card">
            <div className="list-group-item participate-chunk" style={cardStyle}>
                <div className="card-contents">
                    <span className="card-title" style={{fontWeight: '100'}}>{exp.name}</span>
                    <p className="list-group-item-text desc-text">{exp.description}</p>
                </div>
                <div className="card-action">
                {/* <h1>PARTICIPATE</h1> */}
                {/* <Button variant="contained" href={`/apicustomdynamic/${iid}/${detectorUniqueKey}/`}>PARTICIPATE</Button> */}
                  <a href={`/apicustomdynamic/${iid}/${detectorUniqueKey}/`}>PARTICIPATE</a>
                </div>
            </div>
        </div>
        )
    })
}