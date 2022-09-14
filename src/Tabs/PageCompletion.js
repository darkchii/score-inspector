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
            <Grid container spacing={1}>
                <Grid item xs={12/4}><CompletionCardStars data={props.data} /></Grid>
                <Grid item xs={12/4}><CompletionCardAR data={props.data} /></Grid>
                <Grid item xs={12/4}><CompletionCardOD data={props.data} /></Grid>
                <Grid item xs={12/4}><CompletionCardCS data={props.data} /></Grid>
                <Grid item xs={12/4}><CompletionCardLength data={props.data} /></Grid>
                <Grid item xs={12/4}><CompletionCardYear data={props.data} /></Grid>
            </Grid>
        </>
    );
}
export default PageCompletion;