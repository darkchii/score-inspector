import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { useState } from 'react';
import NumberFormat from 'react-number-format';
import TopplaysModal from '../../Components/TopplaysModal';
import { getBeatmapMaxscore, getGrade } from '../../osu';

function GeneralCardPPifFC(props) {
    const [modalData, setModalData] = useState({ active: false });

    const openModal = async () => {
        var _scores = JSON.parse(JSON.stringify(props.data.scores));
        _scores.sort((a, b) => {
            if (a.pp_fc.weight > b.pp_fc.weight) { return -1; }
            if (a.pp_fc.weight < b.pp_fc.weight) { return 1; }
            return 0;
        });
        _scores = _scores.slice(0,200);
        _scores.forEach(score=>{
            score.pp = score.pp_fc.total;
            score.accuracy = score.pp_fc.accuracy*100;
            score.count300 = score.pp_fc.count300;
            score.count100 = score.pp_fc.count100;
            score.count50 = score.pp_fc.count50;
            score.countmiss = score.pp_fc.countmiss;
            score.combo = score.maxcombo;
            score.weight = score.pp_fc.weight;
            score.rank = getGrade(score);
            score.score = -1;
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
                            <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.fc_pp_weighted.toFixed(0)} />pp</Typography>
                            <Typography color="textSecondary">if everything fullcombo</Typography>
                            <Button onClick={openModal} variant='contained' sx={{mt:2}}>See top plays</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardPPifFC;