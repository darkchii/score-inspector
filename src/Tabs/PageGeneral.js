import Grid2 from '@mui/material/Unstable_Grid2';
import React from "react";
import GeneralCardUser from "./GeneralCards/GeneralCardUser";
import GeneralCardClears from "./GeneralCards/GeneralCardClears";
import GeneralCardTotalPP from "./GeneralCards/GeneralCardTotalPP";
import GeneralCardAveragePP from "./GeneralCards/GeneralCardAveragePP";
import GeneralCardAverageSR from "./GeneralCards/GeneralCardAverageSR";
import GeneralCardHighestSR from "./GeneralCards/GeneralCardHighestSR";
import GeneralCardScorePerPlay from "./GeneralCards/GeneralCardScorePerPlay";
import GeneralCardFullComboPerc from "./GeneralCards/GeneralCardFullComboPerc";
import GeneralCardScoreRank from "./GeneralCards/GeneralCardScoreRank";
import GeneralCardTotalLengthPlayed from "./GeneralCards/GeneralCardTotalLengthPlayed";
import GeneralCardAverageLengthPlayed from "./GeneralCards/GeneralCardAverageLengthPlayed";
import GeneralCardTagOccurances from "./GeneralCards/GeneralCardTagOccurances";
import GeneralCardGradeSpread from "./GeneralCards/GeneralCardGradeSpread";
import GeneralCardUsedModCombos from "./GeneralCards/GeneralCardUsedModCombos";
import GeneralCardDonation from "./GeneralCards/GeneralCardDonation";
import config from '../config.json';
import GeneralCardPPifSS from "./GeneralCards/PerformanceCards/GeneralCardPPifSS";
import GeneralCardPPifFC from "./GeneralCards/PerformanceCards/GeneralCardPPifFC";
import GeneralCardPPif2016 from "./GeneralCards/PerformanceCards/GeneralCardPPif2016";
import GeneralCardPPifXexxar from "./GeneralCards/PerformanceCards/GeneralCardPPifXexxar";
import GeneralHighestPPScoreCard from "./GeneralCards/ScoreCards/GeneralHighestPPScoreCard";
import GeneralCardRankedScore from "./GeneralCards/GeneralCardRankedScore";
import GeneralCardApproxPlaytime from "./GeneralCards/GeneralCardApproxPlaytime";
import GeneralCardProfilePlaytime from "./GeneralCards/GeneralCardProfilePlaytime";

function PageGeneral(props) {
    return (
        <>
            <Grid2 container spacing={1}>
                <Grid2 item xs={12} md={12} lg={3}><GeneralCardUser data={props.data} /></Grid2>
                <Grid2 item xs={12} md={12} lg={1.5}><GeneralCardClears data={props.data} /></Grid2>
                <Grid2 item xs={12} md={12} lg={1.5}><GeneralCardTotalPP data={props.data} /></Grid2>
                <Grid2 item xs={12} md={12} lg={1}><GeneralCardAveragePP data={props.data} /></Grid2>
                <Grid2 item xs={12} md={12} lg={1}><GeneralCardAverageSR data={props.data} /></Grid2>
                <Grid2 item xs={12} md={12} lg={2}><GeneralCardHighestSR data={props.data} /></Grid2>
                <Grid2 item xs={6} md={6} lg={1}><GeneralCardFullComboPerc data={props.data} /></Grid2>
                <Grid2 item xs={6} md={6} lg={1}><GeneralCardScoreRank data={props.data} /></Grid2>
                <Grid2 item xs={12} md={12} lg={1.5}><GeneralCardScorePerPlay data={props.data} /></Grid2>
                <Grid2 item xs={12} md={12} lg={2}><GeneralCardAverageLengthPlayed data={props.data} /></Grid2>
                <Grid2 item xs={12} md={12} lg={2.5}><GeneralCardRankedScore data={props.data} /></Grid2>
                <Grid2 item xs={12} md={12} lg={2}><GeneralCardTotalLengthPlayed data={props.data} /></Grid2>
                <Grid2 item xs={12} md={12} lg={2}><GeneralCardProfilePlaytime data={props.data} /></Grid2>
                <Grid2 item xs={12} md={12} lg={2}><GeneralCardApproxPlaytime data={props.data} /></Grid2>
                <Grid2 item xs={12} md={12} lg={2}><GeneralCardTagOccurances data={props.data} /></Grid2>
                <Grid2 item xs={12} md={12} lg={2.5}><GeneralCardGradeSpread data={props.data} /></Grid2>
                <Grid2 item xs={12} md={12} lg={2}><GeneralCardUsedModCombos data={props.data} /></Grid2>
                {
                    config.DONATE_URL ? <><Grid2 item xs={12} md={12} lg={2}><GeneralCardDonation data={props.data} /></Grid2></> : <></>
                }
            </Grid2>
            <Grid2 sx={{ mt: 1 }} container spacing={1}>
                <Grid2 item xs={12} md={4} lg={4}><GeneralHighestPPScoreCard valueTitle={'performance'} valueLabel={`${props.data.processed.topScores.best_pp.pp.toFixed(1)}pp`} score={props.data.processed.topScores.best_pp} /></Grid2>
                <Grid2 item xs={12} md={4} lg={4}><GeneralHighestPPScoreCard valueTitle={'score'} valueLabel={`${props.data.processed.topScores.best_score.score.toLocaleString('en-US')} score`} score={props.data.processed.topScores.best_score} /></Grid2>
                <Grid2 item xs={12} md={4} lg={4}><GeneralHighestPPScoreCard valueTitle={'stars'} valueLabel={`${props.data.processed.topScores.best_sr.star_rating.toFixed(1)}*`} score={props.data.processed.topScores.best_sr} /></Grid2>
            </Grid2>
            <Grid2 sx={{ mt: 1 }} container spacing={1}>
                <Grid2 item xs={12} md={3} lg={3}><GeneralCardPPifFC data={props.data} /></Grid2>
                <Grid2 item xs={12} md={3} lg={3}><GeneralCardPPifSS data={props.data} /></Grid2>
                <Grid2 item xs={12} md={3} lg={3}><GeneralCardPPif2016 data={props.data} /></Grid2>
                <Grid2 item xs={12} md={3} lg={3}><GeneralCardPPifXexxar data={props.data} /></Grid2>
            </Grid2>
        </>
    );
}
export default PageGeneral;