import { Card, CardContent, Typography, Grid } from '@mui/material';
import moment from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';

function GeneralCardApproxPlaytime(props) {
    const [playtime, setPlaytime] = useState(null);

    useEffect(()=>{
        if(props.data.processed.sessions!==undefined){
            let totalPlaytime = 0;
            props.data.processed.sessions.forEach((session)=>{
                totalPlaytime += session.length;
            });
            setPlaytime(Math.round(totalPlaytime));
        }
    }, []);

    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4">{(moment.duration(playtime??0, "seconds").asHours()).toFixed(1)} hours</Typography>
                            <Typography color="textSecondary">approximate playtime</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardApproxPlaytime;