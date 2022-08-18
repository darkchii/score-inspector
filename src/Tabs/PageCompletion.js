import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import CompletionCardAR from "./CompletionCards/CompletionCardAR";
import CompletionCardStars from "./CompletionCards/CompletionCardStars";
import CompletionCardYear from "./CompletionCards/CompletionCardYear";
import FluidGrid from 'react-fluid-grid'
import CompletionCardOD from "./CompletionCards/CompletionCardOD";
import CompletionCardCS from "./CompletionCards/CompletionCardCS";
import CompletionCardLength from "./CompletionCards/CompletionCardLength";

function PageCompletion(props) {
    return (
        <>
            <FluidGrid>
                <Grid><CompletionCardYear data={props.data} /></Grid>
                <Grid><CompletionCardStars data={props.data} /></Grid>
                <Grid><CompletionCardAR data={props.data} /></Grid>
                <Grid><CompletionCardOD data={props.data} /></Grid>
                <Grid><CompletionCardCS data={props.data} /></Grid>
                <Grid><CompletionCardLength data={props.data} /></Grid>
            </FluidGrid>
        </>
    );
}
export default PageCompletion;