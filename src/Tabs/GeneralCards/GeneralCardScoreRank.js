import { Card, CardContent, Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';

function GeneralCardScoreRank(props) {
    const [rank, setRank] = useState(0);

    useEffect(() => {
        setRank(props.data.user.scoreRank);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant='h5'>
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