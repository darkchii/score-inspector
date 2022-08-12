import { Avatar, Card, CardContent, Typography, Grid } from '@mui/material';
import { useEffect } from 'react';
import NumberFormat from 'react-number-format';

function GeneralCardAveragePP(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.average_pp.toFixed(2)} /></Typography>
                            <Typography color="textSecondary">average pp</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardAveragePP;