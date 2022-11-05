import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import TopplaysModal from '../../../Components/TopplaysModal';
import { getGrade } from '../../../osu';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { toFixedNumber } from '../../../helper';

function GeneralCardPPifSS(props) {
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
        setPPDiff(props.data.processed.weighted.ss - props.data.user.statistics.pp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <TopplaysModal data={modalData} />
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography component="div" color="textPrimary" variant="h4">{toFixedNumber(props.data.processed.weighted.ss, 0).toLocaleString('en-US')}pp <Typography color={'' + (ppDiff >= 0 ? '#11cb5f' : 'error')} variant='subtitle2' display="inline">{(ppDiff >= 0 ? '+' : '')}{ppDiff.toFixed(1)}pp</Typography></Typography>
                            <Typography color="textSecondary">if everything 100% accuracy</Typography>
                            <Button startIcon={<AutoGraphIcon />} onClick={openModal} variant='contained' sx={{ mt: 2 }}>See top plays</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardPPifSS;