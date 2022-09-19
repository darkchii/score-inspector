import { Card, CardContent, Typography, Grid } from '@mui/material';
import { toFixedNumber } from '../../helper';

function GeneralCardHighestSR(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4">{toFixedNumber(props.data.processed.highest_sr, 2)}</Typography>
                            <Typography color="textSecondary">highest star rating pass</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardHighestSR;