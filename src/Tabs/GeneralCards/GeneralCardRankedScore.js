import { Card, CardContent, Typography, Grid, Tooltip } from '@mui/material';
import { formatNumber } from '../../helper';

function GeneralCardRankedScore(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Tooltip title={`${props.data.processed.ranked_score.toLocaleString('en-US')} ranked score`}>
                                <Typography color="textPrimary" variant="h4">{formatNumber(props.data.processed.ranked_score)} score</Typography>
                            </Tooltip>
                            <Tooltip title={`${Math.round(props.data.processed.ranked_scorelazer).toLocaleString('en-US')} lazer standardised score`}>
                                <Typography color="textSecondary">{formatNumber(props.data.processed.ranked_scorelazer)} lazer score</Typography>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardRankedScore;