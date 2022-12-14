import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import TopplaysModal from '../../../Components/TopplaysModal';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { toFixedNumber } from '../../../helper';

function GeneralCardPPif2016(props) {
    const [modalData, setModalData] = useState({ active: false });
    const [ppDiff, setPPDiff] = useState(0);

    const openModal = async () => {
        var _scores = JSON.parse(JSON.stringify(props.data.scores));
        _scores.sort((a, b) => {
            if (a.pp_2016.weight > b.pp_2016.weight) { return -1; }
            if (a.pp_2016.weight < b.pp_2016.weight) { return 1; }
            return 0;
        });
        _scores = _scores.slice(0, 200);
        _scores.forEach(score => {
            score.pp = score.pp_2016.total;
            score.pp_cur = score.pp_2016;
        })
        setModalData({
            scores: _scores,
            active: true
        });
    }

    useEffect(() => {
        setPPDiff(props.data.processed.weighted._2016 - props.data.user.statistics.pp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <TopplaysModal data={modalData} />
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography component="div" color="textPrimary" variant="h4">
                                {toFixedNumber(props.data.processed.weighted._2016, 0).toLocaleString('en-US')}pp <Typography color={'' + (ppDiff >= 0 ? '#11cb5f' : 'error')} variant='subtitle2' display="inline">{(ppDiff >= 0 ? '+' : '')}{ppDiff.toFixed(1)}pp</Typography>
                            </Typography>
                            <Typography color="textSecondary">using 2016 ppv2</Typography>
                            <Button startIcon={<AutoGraphIcon />} onClick={openModal} variant='contained' sx={{ mt: 2 }}>See top plays</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardPPif2016;