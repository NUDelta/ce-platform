import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';

export const CEResponse = () => {
  return (
    <div>
      <Accordion>
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Walking Experience 23</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Take a picture of the one that got away... <br /> <br />
          </Typography>
          <Card sx={{ display: "flex", flexDirection: "row" }}>
            <CardMedia
              component="img"
              image="https://i.insider.com/5b1703dc1ae66252008b4c19?width=816&format=jpeg"
              alt="bun bunz"
              sx={{ width: "50%" }}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Jìan-Yáng is a shady app developer living in Erlich Bachman's
                Hacker Hostel and business incubator, Aviato.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ display: "flex", flexDirection: "row" }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Erlich Bachman, portrayed by T.J. Miller, is an arrogant
                entrepreneur who founded an innovation incubator in his home
                after the purchase of his airfare collator Aviato.
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              image="https://static.techspot.com/images2/news/bigimage/2017/05/2017-05-26-image-3.jpg"
              alt="bun bunz"
              sx={{ width: "50%" }}
            />
          </Card>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};