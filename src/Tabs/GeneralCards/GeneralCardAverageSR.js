import { Card, CardContent, Typography, Grid } from '@mui/material';
import { toFixedNumber } from '../../helper';

function GeneralCardAverageSR(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4">{toFixedNumber(props.data.processed.average_sr, 2)}</Typography>
                            <Typography variant="caption" color="textSecondary">average stars</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardAverageSR;