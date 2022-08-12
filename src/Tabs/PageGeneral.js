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
import ReactFluidGrid from "@allpro/react-fluid-grid";

function PageGeneral(props) {
    return (
        <>
            <ReactFluidGrid container spacing={3}>
                <ReactFluidGrid item minWidth={500}><GeneralCardUser data={props.data} /></ReactFluidGrid>
                <ReactFluidGrid item minWidth={300}><GeneralCardClears data={props.data} /></ReactFluidGrid>
                <ReactFluidGrid item minWidth={300}><GeneralCardTotalPP data={props.data} /></ReactFluidGrid>
                <ReactFluidGrid item minWidth={300}><GeneralCardAveragePP data={props.data} /></ReactFluidGrid>
                <ReactFluidGrid item minWidth={300}><GeneralCardAverageSR data={props.data} /></ReactFluidGrid>
                <ReactFluidGrid item minWidth={300}><GeneralCardHighestSR data={props.data} /></ReactFluidGrid>
                <ReactFluidGrid item minWidth={300}><GeneralCardScorePerPlay data={props.data} /></ReactFluidGrid>
                <ReactFluidGrid item minWidth={300}><GeneralCardFullComboPerc data={props.data} /></ReactFluidGrid>
                <ReactFluidGrid item minWidth={300}><GeneralCardPPifFC data={props.data} /></ReactFluidGrid>
                <ReactFluidGrid item minWidth={300}><GeneralCardPPifSS data={props.data} /></ReactFluidGrid>
                <ReactFluidGrid item minWidth={300}><GeneralCardScoreRank data={props.data} /></ReactFluidGrid>
                <ReactFluidGrid item minWidth={300}><GeneralCardTotalLengthPlayed data={props.data} /></ReactFluidGrid>
                <ReactFluidGrid item minWidth={300}><GeneralCardAverageLengthPlayed data={props.data} /></ReactFluidGrid>
            </ReactFluidGrid>
            <br />
            <ReactFluidGrid container spacing={3}>
                <ReactFluidGrid item minWidth={300}><GeneralCardTagOccurances data={props.data} /></ReactFluidGrid>
                <ReactFluidGrid item minWidth={300}><GeneralCardGradeSpread data={props.data} /></ReactFluidGrid>
                <ReactFluidGrid item minWidth={300}><GeneralCardUsedModCombos data={props.data} /></ReactFluidGrid>
            </ReactFluidGrid>
        </>
    );
}
export default PageGeneral;