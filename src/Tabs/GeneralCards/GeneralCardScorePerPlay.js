import { Card, CardContent, Typography, Grid } from '@mui/material';
import NumberFormat from 'react-number-format';

function GeneralCardScorePerPlay(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.average_score.toFixed(0)} /></Typography>
                            <Typography color="textSecondary">score per play</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardScorePerPlay;