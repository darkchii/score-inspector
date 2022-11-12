import { Card, CardContent, Typography, Grid, Tooltip } from '@mui/material';
import moment from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { getAverageAccuracy } from '../../osu';

function GeneralCardAverageAccuracy(props) {
    const [accuracy, setAccuracy] = useState(-1);

    useEffect(() => {
        setAccuracy(getAverageAccuracy(props.data.scores));
    }, [props]);

    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h5">{accuracy.toFixed(2)}%</Typography>
                            <Typography sx={{ display: 'flex' }} color="textSecondary">average acc</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardAverageAccuracy;