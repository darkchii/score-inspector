import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { useState } from 'react';
import NumberFormat from 'react-number-format';
import TopplaysModal from '../../../Components/TopplaysModal';
import { getGrade, getPerformance } from '../../../osu';
import LaunchIcon from '@mui/icons-material/Launch';
import { useEffect } from 'react';

function GeneralCardPPifXexxar(props) {
    const [ppDiff, setPPDiff] = useState(0);

    useEffect(() => {
        setPPDiff(props.data.processed.weighted.xexxar - props.data.user.statistics.pp);
    }, []);

    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography component="div" color="textPrimary" variant="h4">
                                <NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.weighted.xexxar.toFixed(0)} />pp <Typography color={'' + (ppDiff >= 0 ? '#11cb5f' : 'error')} variant='subtitle2' display="inline">{(ppDiff >= 0 ? '+' : '')}{ppDiff.toFixed(1)}pp</Typography>
                            </Typography>
                            <Typography color="textSecondary">with xexxar profile pp proposal</Typography>
                            <Button startIcon={<LaunchIcon />} href='https://github.com/ppy/osu/discussions/20210' target='_blank' variant='contained' sx={{ mt: 2 }}>See proposal</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardPPifXexxar;