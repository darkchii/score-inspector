import { Card, CardContent, Typography, Grid } from '@mui/material';

function GeneralCardTotalLengthPlayed(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4">{(props.data.processed.total_length / 60 / 60).toFixed(1)} hours</Typography>
                            <Typography color="textSecondary">total length</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardTotalLengthPlayed;