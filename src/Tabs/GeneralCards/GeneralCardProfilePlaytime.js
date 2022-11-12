import { Card, CardContent, Typography, Grid } from '@mui/material';
import moment from 'moment';

function GeneralCardProfilePlaytime(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h5">{(moment.duration(props.data.user.statistics.play_time, "seconds")).asHours().toFixed(1)} hours</Typography>
                            <Typography color="textSecondary">profile playtime</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardProfilePlaytime;