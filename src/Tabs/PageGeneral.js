import { Grid } from "@mui/material";
import React, { useEffect } from "react";
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

function PageGeneral(props) {
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <GeneralCardUser data={props.data} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <GeneralCardClears data={props.data} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <GeneralCardTotalPP data={props.data} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <GeneralCardAveragePP data={props.data} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <GeneralCardAverageSR data={props.data} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <GeneralCardHighestSR data={props.data} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <GeneralCardScorePerPlay data={props.data} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <GeneralCardFullComboPerc data={props.data} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <GeneralCardPPifFC data={props.data} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <GeneralCardPPifSS data={props.data} />
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={3} md={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={12}>
                            <GeneralCardScoreRank data={props.data} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <GeneralCardTotalLengthPlayed data={props.data} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <GeneralCardAverageLengthPlayed data={props.data} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                    <GeneralCardTagOccurances data={props.data} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <GeneralCardGradeSpread data={props.data} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <GeneralCardUsedModCombos data={props.data} />
                </Grid>
            </Grid>
        </>
    );
}
export default PageGeneral;