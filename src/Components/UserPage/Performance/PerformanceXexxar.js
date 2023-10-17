import LaunchIcon from '@mui/icons-material/Launch';
import { Button, Grid, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { toFixedNumber } from '../../../Helpers/Misc';
import GlowBar from '../../UI/GlowBar';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

function PerformanceXexxar(props) {
    const [ppDiff, setPPDiff] = useState(0);

    useEffect(() => {
        setPPDiff(props.data.data.performance.weighted['xexxar'] - props.data.osu.statistics.pp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                <Grid item>
                    <Grid position={'relative'}>
                        <GlowBar />
                        <Typography component="div" color="textPrimary" variant="body1">
                            {/* warning icon, make it inline without adjusting the height */}
                            <Tooltip title="This is an experimental proposal. It's subject to change or may be abandoned in the future.">
                                <WarningAmberIcon sx={{ fontSize: '1rem', verticalAlign: 'middle' }} color='warning' />
                            </Tooltip>
                            {/* pp value */}
                            {toFixedNumber(props.data.data.performance.weighted['xexxar'], 0).toLocaleString('en-US')}pp <Typography sx={{ fontSize: '0.7rem' }} color={'' + (ppDiff >= 0 ? '#11cb5f' : 'error')} variant='subtitle2' display="inline">{(ppDiff >= 0 ? '+' : '')}{ppDiff.toFixed(1)}pp</Typography>
                        </Typography>
                    </Grid>
                    <Typography color="textSecondary">xexxar bonus</Typography>
                    <Button size='small' startIcon={<LaunchIcon />} href='https://github.com/ppy/osu/discussions/20210' target='_blank' variant='contained' sx={{ mt: 2 }}>Proposal</Button>
                </Grid>
            </Grid>
        </>
    );
}
export default PerformanceXexxar;