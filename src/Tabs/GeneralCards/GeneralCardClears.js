import { Card, CardContent, Typography, Grid } from '@mui/material';

function GeneralCardClears(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4">{props.data.processed.scoreCount.toLocaleString('en-US')}</Typography>
                            <Typography color="textSecondary">clears</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardClears;