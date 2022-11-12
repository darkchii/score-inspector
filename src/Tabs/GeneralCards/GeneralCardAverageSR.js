import { Card, CardContent, Typography, Grid } from '@mui/material';
import { toFixedNumber } from '../../helper';

function GeneralCardAverageSR(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h5">{toFixedNumber(props.data.processed.average_sr, 2)}*</Typography>
                            <Typography color="textSecondary">average sr</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardAverageSR;