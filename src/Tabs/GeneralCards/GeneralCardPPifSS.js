import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { useState } from 'react';
import NumberFormat from 'react-number-format';
import TopplaysModal from '../../Components/TopplaysModal';
import { getGrade, getPerformance } from '../../osu';

function GeneralCardPPifSS(props) {
    const [modalData, setModalData] = useState({ active: false });

    const openModal = async () => {
        var _scores = JSON.parse(JSON.stringify(props.data.scores));
        _scores.sort((a, b) => {
            if (a.pp_ss.weight > b.pp_ss.weight) { return -1; }
            if (a.pp_ss.weight < b.pp_ss.weight) { return 1; }
            return 0;
        });
        _scores = _scores.slice(0,200);
        _scores.forEach(score=>{
            score.pp = score.pp_ss.total;
            score.accuracy = score.pp_ss.accuracy*100;
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

    return (
        <>
            <TopplaysModal data={modalData} />
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.ss_pp_weighted.toFixed(0)} />pp</Typography>
                            <Typography color="textSecondary">if everything 100% accuracy</Typography>
                            <Button onClick={openModal} variant='contained' sx={{mt:2}}>See top plays</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardPPifSS;