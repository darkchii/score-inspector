import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { toFixedNumber } from "../../../Helpers/Misc";
import { getGrade } from "../../../Helpers/Osu";
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import TopplaysModal from "../../Modals/TopplaysModal";

function PerformanceFC(props) {
    const [modalData, setModalData] = useState({ active: false });
    const [ppDiff, setPPDiff] = useState(0);

    const openModal = async () => {
        var _scores = JSON.parse(JSON.stringify(props.data.scores));
        _scores.sort((a, b) => {
            if (a.pp_fc.weight > b.pp_fc.weight) { return -1; }
            if (a.pp_fc.weight < b.pp_fc.weight) { return 1; }
            return 0;
        });
        _scores = _scores.slice(0, 200);
        _scores.forEach(score => {
            score.pp = score.pp_fc.total;
            score.accuracy = score.pp_fc.accuracy * 100;
            score.count300 = score.pp_fc.count300;
            score.count100 = score.pp_fc.count100;
            score.count50 = score.pp_fc.count50;
            score.countmiss = score.pp_fc.countmiss;
            score.combo = score.maxcombo;
            score.weight = score.pp_fc.weight;
            score.rank = getGrade(score);
            score.score = -1;
            score.displayed_pp = structuredClone(score.pp_fc);
        })
        setModalData({
            scores: _scores,
            active: true
        })
    }

    useEffect(() => {
        setPPDiff(props.data.data.performance.weighted.fc - props.data.osu.statistics.pp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Card>
                <CardContent>
                    <Grid container sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography component="div" color="textPrimary" variant="body1">
                                {toFixedNumber(props.data.data.performance.weighted.fc, 0).toLocaleString('en-US')}pp <Typography sx={{fontSize: '0.7rem'}} color={'' + (ppDiff >= 0 ? '#11cb5f' : 'error')} variant='subtitle2' display="inline">{(ppDiff >= 0 ? '+' : '')}{ppDiff.toFixed(1)}pp</Typography>
                            </Typography>
                            <Typography color="textSecondary">all FC</Typography>
                            <Button size='small' startIcon={<AutoGraphIcon />} onClick={openModal} variant='contained' sx={{ mt: 2 }}>Top plays</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <TopplaysModal data={modalData} />
        </>
    );
}
export default PerformanceFC;