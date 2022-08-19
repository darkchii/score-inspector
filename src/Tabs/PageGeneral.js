import { Grid } from "@mui/material";
import React from "react";
import GeneralCardUser from "./GeneralCards/GeneralCardUser";
import GeneralCardClears from "./GeneralCards/GeneralCardClears";
import GeneralCardTotalPP from "./GeneralCards/GeneralCardTotalPP";
import GeneralCardAveragePP from "./GeneralCards/GeneralCardAveragePP";
import GeneralCardAverageSR from "./GeneralCards/GeneralCardAverageSR";
import GeneralCardHighestSR from "./GeneralCards/GeneralCardHighestSR";
import GeneralCardScorePerPlay from "./GeneralCards/GeneralCardScorePerPlay";
import GeneralCardFullComboPerc from "./GeneralCards/GeneralCardFullComboPerc";
import GeneralCardPPifFC from "./GeneralCards/GeneralCardPPifFC";
import GeneralCardPPifSS from "./GeneralCards/GeneralCardPPifSS";
import GeneralCardScoreRank from "./GeneralCards/GeneralCardScoreRank";
import GeneralCardTotalLengthPlayed from "./GeneralCards/GeneralCardTotalLengthPlayed";
import GeneralCardAverageLengthPlayed from "./GeneralCards/GeneralCardAverageLengthPlayed";
import GeneralCardTagOccurances from "./GeneralCards/GeneralCardTagOccurances";
import GeneralCardGradeSpread from "./GeneralCards/GeneralCardGradeSpread";
import GeneralCardUsedModCombos from "./GeneralCards/GeneralCardUsedModCombos";
import FluidGrid from 'react-fluid-grid'
import GeneralCardDonation from "./GeneralCards/GeneralCardDonation";
import config from '../config.json';

function PageGeneral(props) {
    return (
        <>
            <FluidGrid>
                <Grid><GeneralCardUser data={props.data} /></Grid>
                <Grid><GeneralCardClears data={props.data} /></Grid>
                <Grid><GeneralCardTotalPP data={props.data} /></Grid>
                <Grid><GeneralCardAveragePP data={props.data} /></Grid>
                <Grid><GeneralCardAverageSR data={props.data} /></Grid>
                <Grid><GeneralCardHighestSR data={props.data} /></Grid>
                <Grid><GeneralCardTagOccurances data={props.data} /></Grid>
                <Grid><GeneralCardGradeSpread data={props.data} /></Grid>
                <Grid><GeneralCardUsedModCombos data={props.data} /></Grid>
                <Grid><GeneralCardScorePerPlay data={props.data} /></Grid>
                <Grid><GeneralCardFullComboPerc data={props.data} /></Grid>
                <Grid><GeneralCardPPifFC data={props.data} /></Grid>
                <Grid><GeneralCardPPifSS data={props.data} /></Grid>
                <Grid><GeneralCardScoreRank data={props.data} /></Grid>
                <Grid><GeneralCardTotalLengthPlayed data={props.data} /></Grid>
                <Grid><GeneralCardAverageLengthPlayed data={props.data} /></Grid>
                {
                    config.DONATE_URL ? <><Grid><GeneralCardDonation data={props.data} /></Grid></> : <></>
                }
            </FluidGrid>
        </>
    );
}
export default PageGeneral;