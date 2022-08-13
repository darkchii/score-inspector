import { Card, CardContent, Typography, Grid } from '@mui/material';
import NumberFormat from 'react-number-format';

function GeneralCardClears(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.scoreCount} /></Typography>
                            <Typography color="textSecondary">clears</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardClears;