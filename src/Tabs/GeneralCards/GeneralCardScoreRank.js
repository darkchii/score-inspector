import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';

function GeneralCardScoreRank(props) {
    const [rank, setRank] = useState(0);

    useEffect(() => {
        setRank(props.data.user.scoreRank);
    }, []);
    return (
        <>
            <Card sx={{height:'100%'}}>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant={rank < 10000 ? 'h4' : 'h5'}>
                                {rank <= 10000 ?
                                    <>#{props.data.user.scoreRank.toLocaleString("en-US")}</>
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