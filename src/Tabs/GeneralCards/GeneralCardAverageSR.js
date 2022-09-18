import { Card, CardContent, Typography, Grid } from '@mui/material';
import NumberFormat from 'react-number-format';

function GeneralCardAverageSR(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.average_sr.toFixed(2)} />*</Typography>
                            <Typography variant="caption" color="textSecondary">average stars</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardAverageSR;