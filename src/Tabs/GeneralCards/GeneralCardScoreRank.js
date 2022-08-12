import { Avatar, Card, CardContent, Typography, Grid } from '@mui/material';
import { useEffect } from 'react';
import NumberFormat from 'react-number-format';

function GeneralCardScoreRank(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4">
                                {props.data.user.scoreRank !== undefined && props.data.user.scoreRank > 0 ?
                                    <>#<NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.user.scoreRank.toLocaleString("en-US")} /></>
                                    : <>&gt;#10,000</>}
                            </Typography>
                            <Typography color="textSecondary">score rank</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardScoreRank;