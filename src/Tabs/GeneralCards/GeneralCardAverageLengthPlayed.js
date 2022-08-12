import { Avatar, Card, CardContent, Typography, Grid } from '@mui/material';
import moment from 'moment';
import { useEffect } from 'react';
import NumberFormat from 'react-number-format';

function GeneralCardAverageLengthPlayed(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4">{moment.utc(moment.duration(props.data.processed.average_length, "seconds").asMilliseconds()).format("mm:ss")} minutes</Typography>
                            <Typography color="textSecondary">average length</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardAverageLengthPlayed;