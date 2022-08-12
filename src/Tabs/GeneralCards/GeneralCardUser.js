import { Avatar, Card, CardContent, Typography, Grid } from '@mui/material';
import NumberFormat from 'react-number-format';

function GeneralCardUser(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4">{props.data.user.username}</Typography>
                            <Typography color="textSecondary"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.user.statistics.pp} />pp #<NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.user.statistics.global_rank} /> ({props.data.user.country_code}#<NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.user.statistics.country_rank} />)</Typography>
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