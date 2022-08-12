import { Avatar, Card, CardContent, Typography, Grid } from '@mui/material';
import { useEffect } from 'react';
import NumberFormat from 'react-number-format';

function GeneralCardPPifSS(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.ss_pp_weighted.toFixed(0)} />pp</Typography>
                            <Typography color="textSecondary">if everything 100% accuracy</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardPPifSS;