import LaunchIcon from '@mui/icons-material/Launch';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import Marquee from 'react-fast-marquee';
import { toFixedNumber } from '../../../Helpers/Misc';

function PerformanceXexxar(props) {
    const [ppDiff, setPPDiff] = useState(0);

    useEffect(() => {
        setPPDiff(props.data.data.performance.weighted.xexxar - props.data.osu.statistics.pp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography component="div" color="textPrimary" variant="h4">
                                {toFixedNumber(props.data.data.performance.weighted.xexxar, 0).toLocaleString('en-US')}pp <Typography color={'' + (ppDiff >= 0 ? '#11cb5f' : 'error')} variant='subtitle2' display="inline">{(ppDiff >= 0 ? '+' : '')}{ppDiff.toFixed(1)}pp</Typography>
                            </Typography>
                            <Marquee speed={40} gradient={false}>
                                <Typography color="textSecondary">with xexxar profile pp proposal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                            </Marquee>
                            <Button startIcon={<LaunchIcon />} href='https://github.com/ppy/osu/discussions/20210' target='_blank' variant='contained' sx={{ mt: 2 }}>See proposal</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default PerformanceXexxar;