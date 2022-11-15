import React from 'react';
import Button from '@mui/material/Button';
 
import '../stylesheets/layout.scss';

export const RActiveExperience = ({allExperience}) => {
    let waitingSubmissionBlock;
    if (allExperience[0].length > 0) {
        let waitingSubmission = mapExperience(allExperience[0])
        waitingSubmissionBlock = 
        <div>
            <h4>Here's what your partner already submitted!</h4>
            <h5>Don't have a current experience for this activity? Share your most recent experience with your partner instead!</h5>
            {waitingSubmission} 
        </div>
    }
    let rest = 
        <div>
            <h4>Available Experiences</h4>
            {mapExperience(allExperience[1])}
        </div>
    return (
        <div>
            {waitingSubmissionBlock}
            {rest}
        </div> 
    )
    }


const mapExperience = (experiences) => {
    return experiences.map((experience) => {
        let exp = experience.experience
        let iid = experience.iid
        let detectorUniqueKey = experience.detectorUniqueKey;
        return(
            <div className="card">
            <div className="list-group-item participate-chunk" style={{borderRadius: '1px', padding: '0px'}}>
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