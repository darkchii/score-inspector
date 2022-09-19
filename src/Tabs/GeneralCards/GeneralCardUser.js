import { Avatar, Card, CardContent, Typography, Grid } from '@mui/material';
import { toFixedNumber } from '../../helper';

function GeneralCardUser(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4">{props.data.user.username}</Typography>
                            <Typography color="textSecondary">{toFixedNumber(props.data.user.statistics.pp, 0).toLocaleString('en-US')}pp #{props.data.user.statistics.country_rank.toLocaleString('en-US')}</Typography>
                        </Grid>
                        <Grid item>
                            <Avatar src={props.data.user.avatar_url} sx={{ width: 56, height: 56 }} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardUser;