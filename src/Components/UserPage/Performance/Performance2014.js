import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { Button, Card, CardContent, Grid, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import Marquee from 'react-fast-marquee';
import { toFixedNumber } from '../../../Helpers/Misc';
import TopplaysModal from '../../Modals/TopplaysModal';

function Performance2014(props) {
    const [modalData, setModalData] = useState({ active: false });
    const [ppDiff, setPPDiff] = useState(0);

    const openModal = async () => {
        var _scores = JSON.parse(JSON.stringify(props.data.scores));
        _scores.sort((a, b) => {
            if (a.pp_2014.weight > b.pp_2014.weight) { return -1; }
            if (a.pp_2014.weight < b.pp_2014.weight) { return 1; }
            return 0;
        });
        _scores = _scores.slice(0, 200);
        _scores.forEach(score => {
            score.pp = score.pp_2014.total;
            score.pp_cur = score.pp_2014;
        })
        setModalData({
            scores: _scores,
            active: true
        });
    }

    useEffect(() => {
        setPPDiff(props.data.data.performance.weighted._2014 - props.data.osu.statistics.pp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <TopplaysModal data={modalData} />
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography component="div" color="textPrimary" variant="body1">
                                {toFixedNumber(props.data.data.performance.weighted._2014, 0).toLocaleString('en-US')}pp <Typography sx={{ fontSize: '0.7rem' }} color={'' + (ppDiff >= 0 ? '#11cb5f' : 'error')} variant='subtitle2' display="inline">{(ppDiff >= 0 ? '+' : '')}{ppDiff.toFixed(1)}pp</Typography>
                            </Typography>
                            <Tooltip title='Assuming current day starratings'>
                                <Typography color="textSecondary">2014 ppv2</Typography>
                            </Tooltip>
                            <Button size='small' startIcon={<AutoGraphIcon />} onClick={openModal} variant='contained' sx={{ mt: 2 }}>Top plays</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default Performance2014;