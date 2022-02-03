import React from 'react';
import Button from '@mui/material/Button';

import '../stylesheets/layout.scss';

export const RActiveExperience = ({exp, iid, detectorUniqueKey}) => {
    // const link = `/apicustomdynamic/${iid}`
    return(
        <div className="card">
        <div className="list-group-item participate-chunk" style={{borderRadius: '1px', padding: '0px'}}>
            <div className="card-contents">
                <span className="card-title" style={{fontWeight: '100'}}>{exp.name}</span>
                <p className="list-group-item-text desc-text">{exp.description}</p>
            </div>
            <div className="card-action">
            {/* <h1>PARTICIPATE</h1> */}
            <Button variant="contained" href={`/apicustomdynamic/${iid}/${detectorUniqueKey}/`}>PARTICIPATE</Button>
              {/* <a href="/apicustomdynamic/{{iid}}/{{detectorUniqueKey}}/">PARTICIPATE</a> */}
            </div>
        </div>
    </div>
    )
}
