import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { useState } from 'react';
import NumberFormat from 'react-number-format';
import TopplaysModal from '../../../Components/TopplaysModal';
import { getGrade, getPerformance } from '../../../osu';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

function GeneralCardPPif2016(props) {
    const [modalData, setModalData] = useState({ active: false });

    const openModal = async () => {
        var _scores = JSON.parse(JSON.stringify(props.data.scores));
        _scores.sort((a, b) => {
            if (a.pp_2016.weight > b.pp_2016.weight) { return -1; }
            if (a.pp_2016.weight < b.pp_2016.weight) { return 1; }
            return 0;
        });
        _scores = _scores.slice(0,200);
        _scores.forEach(score=>{
            score.pp = score.pp_2016.total;
            score.pp_cur = score.pp_2016;
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
                            <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.weighted._2016.toFixed(0)} />pp</Typography>
                            <Typography color="textSecondary">if using 2016 ppv2</Typography>
                            <Button startIcon={<AutoGraphIcon />} onClick={openModal} variant='contained' sx={{mt:2}}>See top plays</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardPPif2016;