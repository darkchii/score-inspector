import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { toFixedNumber } from "../../../Helpers/Misc";
import { getGrade } from "../../../Helpers/Osu";
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import TopplaysModal from "../../Modals/TopplaysModal";
import Marquee from "react-fast-marquee";

function PerformanceLazer(props) {
    const [modalData, setModalData] = useState({ active: false });
    const [ppDiff, setPPDiff] = useState(0);

    const openModal = async () => {
        var _scores = JSON.parse(JSON.stringify(props.data.scores));
        _scores.sort((a, b) => {
            if (a.pp_lazer.weight > b.pp_lazer.weight) { return -1; }
            if (a.pp_lazer.weight < b.pp_lazer.weight) { return 1; }
            return 0;
        });
        _scores = _scores.slice(0, 200);
        _scores.forEach(score => {
            score.pp = score.pp_lazer.total;
            score.displayed_pp = structuredClone(score.pp_lazer);
            score.weight = score.displayed_pp.weight;
        })
        console.log(_scores);
        setModalData({
            scores: _scores,
            active: true,
            pp_version: 'lazer'
        });
    }

    useEffect(() => {
        setPPDiff(props.data.data.performance.weighted.lazer - props.data.osu.statistics.pp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Card>
                <CardContent>
                    <Grid container sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography component="div" color="textPrimary" variant="body1">
                                {toFixedNumber(props.data.data.performance.weighted.lazer, 0).toLocaleString('en-US')}pp <Typography sx={{fontSize: '0.7rem'}} color={'' + (ppDiff >= 0 ? '#11cb5f' : 'error')} variant='subtitle2' display="inline">{(ppDiff >= 0 ? '+' : '')}{ppDiff.toFixed(1)}pp</Typography>
                            </Typography>
                            <Typography color="textSecondary">lazer</Typography>
                            <Button size='small' startIcon={<AutoGraphIcon />} onClick={openModal} variant='contained' sx={{ mt: 2 }}>Top plays</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <TopplaysModal data={modalData} />
        </>
    );
}
export default PerformanceLazer;