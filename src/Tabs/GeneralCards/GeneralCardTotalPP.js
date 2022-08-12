import { Avatar, Card, CardContent, Typography, Grid } from '@mui/material';
import { useEffect } from 'react';
import NumberFormat from 'react-number-format';

function GeneralCardTotalPP(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.total_pp.toFixed(0)} /></Typography>
                            <Typography color="textSecondary">total pp</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardTotalPP;