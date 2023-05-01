import { Grid, Paper } from "@mui/material";
import LevelIcon from "../Components/UI/LevelIcon";

function CompDev() {
    return (
        <>
            <h2>Are you supposed to be here?</h2>
            <Grid container sx={{ height: '50px' }} spacing={2}>
                <Grid item xs={2} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <LevelIcon />
                    </Paper>
                </Grid>
                <Grid item xs={4} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <LevelIcon />
                    </Paper>
                </Grid>
                <Grid item xs={5} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <LevelIcon />
                    </Paper>
                </Grid>
                <Grid item xs={1} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <LevelIcon />
                    </Paper>
                </Grid>
            </Grid>
            <Grid container sx={{ height: '150px', pt: 1 }} spacing={2}>
                <Grid item xs={2} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <LevelIcon />
                    </Paper>
                </Grid>
                <Grid item xs={4} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <LevelIcon />
                    </Paper>
                </Grid>
                <Grid item xs={5} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <LevelIcon />
                    </Paper>
                </Grid>
                <Grid item xs={1} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <LevelIcon />
                    </Paper>
                </Grid>
            </Grid>
            <Grid container sx={{ height: '350px', pt: 1 }} spacing={2}>
                <Grid item xs={2} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <LevelIcon />
                    </Paper>
                </Grid>
                <Grid item xs={4} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <LevelIcon />
                    </Paper>
                </Grid>
                <Grid item xs={5} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <LevelIcon />
                    </Paper>
                </Grid>
                <Grid item xs={1} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%' }} elevation={5}>
                        <LevelIcon />
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

export default CompDev;