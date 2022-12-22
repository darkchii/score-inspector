import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { toFixedNumber } from '../../../Helpers/Misc';
import { getGrade } from '../../../Helpers/Osu';
import TopplaysModal from '../../Modals/TopplaysModal';

function PerformanceSS(props) {
    const [modalData, setModalData] = useState({ active: false });
    const [ppDiff, setPPDiff] = useState(0);

    const openModal = async () => {
        var _scores = JSON.parse(JSON.stringify(props.data.scores));
        _scores.sort((a, b) => {
            if (a.pp_ss.weight > b.pp_ss.weight) { return -1; }
            if (a.pp_ss.weight < b.pp_ss.weight) { return 1; }
            return 0;
        });
        _scores = _scores.slice(0, 200);
        _scores.forEach(score => {
            score.pp = score.pp_ss.total;
            score.accuracy = score.pp_ss.accuracy * 100;
            score.count300 = score.pp_ss.count300;
            score.count100 = score.pp_ss.count100;
            score.count50 = score.pp_ss.count50;
            score.countmiss = score.pp_ss.countmiss;
            score.combo = score.maxcombo;
            score.weight = score.pp_ss.weight;
            score.rank = getGrade(score);
            score.score = -1;
            score.pp_cur = score.pp_ss;
        })
        setModalData({
            scores: _scores,
            active: true
        })
    }

    useEffect(() => {
        setPPDiff(props.data.data.performance.weighted.ss - props.data.osu.statistics.pp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <TopplaysModal data={modalData} />
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography component="div" color="textPrimary" variant="h6">{toFixedNumber(props.data.data.performance.weighted.ss, 0).toLocaleString('en-US')}pp <Typography color={'' + (ppDiff >= 0 ? '#11cb5f' : 'error')} variant='subtitle2' display="inline">{(ppDiff >= 0 ? '+' : '')}{ppDiff.toFixed(1)}pp</Typography></Typography>
                            <Typography color="textSecondary">if everything 100% accuracy</Typography>
                            <Button startIcon={<AutoGraphIcon />} onClick={openModal} variant='contained' sx={{ mt: 2 }}>See top plays</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default PerformanceSS;