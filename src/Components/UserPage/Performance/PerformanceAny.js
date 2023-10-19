import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { Button, Grid, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { toFixedNumber } from '../../../Helpers/Misc';
import TopplaysModal from '../../Modals/TopplaysModal';
import GlowBar from '../../UI/GlowBar';
import { PP_SYSTEM_NAMES } from '../../../Helpers/Osu.js';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
var _ = require('lodash');

//should be able to process any normal performance data (2014may, 2014july, 2018 etc)
function PerformanceAny(props) {
    const [modalData, setModalData] = useState({ active: false });
    const [ppDiff, setPPDiff] = useState(0);

    const openModal = async () => {
        let scores = props.data.scores;
        scores.sort((a, b) => {
            if (a.recalc[props.pp_version].total > b.recalc[props.pp_version].total) { return -1; }
            if (a.recalc[props.pp_version].total < b.recalc[props.pp_version].total) { return 1; }
            return 0;
        });

        var _scores = _.cloneDeep(props.data.scores.slice(0, 2000));
        scores.sort((a, b) => {
            if (a.pp > b.pp) { return -1; }
            if (a.pp < b.pp) { return 1; }
            return 0;
        });
        setModalData({
            scores: _scores,
            active: true,
            pp_version: props.pp_version,
            hide_diff: props.hide_diff,
        });
    }

    useEffect(() => {
        setPPDiff(props.data.data.performance.weighted[props.pp_version] - props.data.osu.statistics.pp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <TopplaysModal data={modalData} />
            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                <Grid item>
                    <Grid position={'relative'}>
                        <GlowBar />
                        <Typography component="div" color="textPrimary" variant="body1">
                            {
                                props.is_experimental ?
                                    <Tooltip title="This is an experimental proposal. It's subject to change or may be abandoned in the future.">
                                        <WarningAmberIcon sx={{ fontSize: '1rem', verticalAlign: 'middle' }} color='warning' />
                                    </Tooltip>
                                    : null
                            }
                            {toFixedNumber(props.data.data.performance.weighted[props.pp_version], 0).toLocaleString('en-US')}pp {props.hide_diff ? <></> : <Typography sx={{ fontSize: '0.7rem' }} color={'' + (ppDiff >= 0 ? '#11cb5f' : 'error')} variant='subtitle2' display="inline">{(ppDiff >= 0 ? '+' : '')}{ppDiff.toFixed(1)}pp</Typography>}
                        </Typography>
                    </Grid>
                    <Tooltip title={`${PP_SYSTEM_NAMES[props.pp_version].description ?? ' '}`}>
                        <Typography color="textSecondary">{PP_SYSTEM_NAMES[props.pp_version].title ?? props.pp_version}</Typography>
                    </Tooltip>
                    <Button size='small' startIcon={<AutoGraphIcon />} onClick={openModal} variant='contained' sx={{ mt: 2 }}>Top plays</Button>
                </Grid>
            </Grid>
        </>
    );
}
export default PerformanceAny;