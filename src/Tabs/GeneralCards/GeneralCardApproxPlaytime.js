import { Card, CardContent, Typography, Grid, Tooltip } from '@mui/material';
import moment from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const infoText = 'This value is based off your playcount, profile playtime, and session playtime. It is not 100% accurate, but it is a good estimate.';

function GeneralCardApproxPlaytime(props) {
    const [playtime, setPlaytime] = useState(null);

    useEffect(() => {
        if (props.data.processed.sessions !== undefined) {
            let totalPlaytime = 0;
            props.data.processed.sessions.forEach((session) => {
                totalPlaytime += session.length;
            });
            let idleTime = props.data.user.statistics.play_time - props.data.processed.total_length;
            let playcountTime = props.data.user.statistics.play_count * (props.data.processed.average_length * 0.5);

            setPlaytime(Math.round((totalPlaytime + playcountTime + idleTime * (Math.log10(idleTime) * 0.1)) * 0.5));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h5">{(moment.duration(playtime ?? 0, "seconds").asHours()).toFixed(1)} hours</Typography>
                            <Typography sx={{ display: 'flex' }} color="textSecondary">approximate playtime <Tooltip title={infoText}><InfoOutlinedIcon sx={{ ml: 1 }} /></Tooltip></Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardApproxPlaytime;