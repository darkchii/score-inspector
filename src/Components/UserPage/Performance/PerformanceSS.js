import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { Button, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { toFixedNumber } from '../../../Helpers/Misc';
import { getGrade } from '../../../Helpers/Osu';
import TopplaysModal from '../../Modals/TopplaysModal';
import GlowBar from '../../UI/GlowBar';
var _ = require('lodash');

function PerformanceSS(props) {
    const [modalData, setModalData] = useState({ active: false });
    const [ppDiff, setPPDiff] = useState(0);

    const openModal = async () => {
        let scores = props.data.scores;
        scores.sort((a, b) => {
            if (a.recalc['ss'].total > b.recalc['ss'].total) { return -1; }
            if (a.recalc['ss'].total < b.recalc['ss'].total) { return 1; }
            return 0;
        });
        
        var _scores = _.cloneDeep(props.data.scores.slice(0, 2000));

        _scores.forEach(score => {
            let pp = score.recalc['ss'];
            score.pp = pp.total;
            score.accuracy = pp.accuracy * 100;
            score.count300 = pp.count300;
            score.count100 = pp.count100;
            score.count50 = pp.count50;
            score.countmiss = pp.countmiss;
            score.combo = score.beatmap.maxcombo;
            score.weight = pp.weight;
            score.rank = getGrade(score);
            score.score = -1;
            score.displayed_pp = structuredClone(pp);
        })
        setModalData({
            scores: _scores,
            active: true,
            pp_version: 'ss'
        })
        console.timeEnd('Top plays modal');
    }

    useEffect(() => {
        setPPDiff(props.data.data.performance.weighted.ss - props.data.osu.statistics.pp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <TopplaysModal data={modalData} />
            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                <Grid item>
                    <Grid position={'relative'}>
                        <GlowBar />
                        <Typography component="div" color="textPrimary" variant="body1">{toFixedNumber(props.data.data.performance.weighted.ss, 0).toLocaleString('en-US')}pp <Typography sx={{ fontSize: '0.7rem' }} color={'' + (ppDiff >= 0 ? '#11cb5f' : 'error')} variant='subtitle2' display="inline">{(ppDiff >= 0 ? '+' : '')}{ppDiff.toFixed(1)}pp</Typography></Typography>
                    </Grid>
                    <Typography color="textSecondary">all SS</Typography>
                    <Button size='small' startIcon={<AutoGraphIcon />} onClick={openModal} variant='contained' sx={{ mt: 2 }}>Top plays</Button>
                </Grid>
            </Grid>
        </>
    );
}
export default PerformanceSS;