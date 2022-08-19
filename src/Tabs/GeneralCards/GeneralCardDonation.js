import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import config from '../../config.json';

function GeneralCardDonation(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item sx={{width: '100%'}}>
                            <Typography>If you wish to help me out keeping the website alive or buy me food.</Typography>
                            <Button href={config.DONATE_URL} target="_blank" rel="noreferrer" sx={{width:'100%',mt:2}} color="success" variant="contained">Donate</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardDonation;