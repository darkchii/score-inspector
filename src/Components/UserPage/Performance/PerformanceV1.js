import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { Button, Grid, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { toFixedNumber } from '../../../Helpers/Misc';
import TopplaysModal from '../../Modals/TopplaysModal';
import GlowBar from '../../UI/GlowBar';

function PerformanceV1(props) {
    const [modalData, setModalData] = useState({ active: false });
    const [ppDiff, setPPDiff] = useState(0);

    const openModal = async () => {
        var _scores = [...props.data.scores];
        _scores.sort((a, b) => {
            if (a.pp_v1.total > b.pp_v1.total) { return -1; }
            if (a.pp_v1.total < b.pp_v1.total) { return 1; }
            return 0;
        });
        _scores.forEach(score => {
            score.pp = score.pp_v1.total;
            score.displayed_pp = structuredClone(score.pp_v1);
        })
        setModalData({
            scores: _scores,
            active: true,
            pp_version: 'v1'
        });
    }

    useEffect(() => {
        setPPDiff(props.data.data.performance.weighted.v1 - props.data.osu.statistics.pp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <TopplaysModal allowScoreViewer={false} data={modalData} />
            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                <Grid item>
                    <Grid position={'relative'}>
                        <GlowBar />
                        <Typography component="div" color="textPrimary" variant="body1">
                            {toFixedNumber(props.data.data.performance.weighted.v1, 0).toLocaleString('en-US')}pp <Typography sx={{ fontSize: '0.7rem' }} color={'' + (ppDiff >= 0 ? '#11cb5f' : 'error')} variant='subtitle2' display="inline">{(ppDiff >= 0 ? '+' : '')}{ppDiff.toFixed(1)}pp</Typography>
                        </Typography>
                    </Grid>
                    <Tooltip title='Using pp v1 calculation'>
                        <Typography color="textSecondary">ppv1</Typography>
                    </Tooltip>
                    <Button size='small' startIcon={<AutoGraphIcon />} onClick={openModal} variant='contained' sx={{ mt: 2 }}>Top plays</Button>
                </Grid>
            </Grid>
        </>
    );
}
export default PerformanceV1;