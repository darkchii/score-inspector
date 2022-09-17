import { Alert, AlertTitle, Box, Button, Card, CardContent, FormControlLabel, Grid, Paper, Step, StepLabel, Stepper, Switch, Typography } from "@mui/material";
import React from "react";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

function FileSelector(props) {
    const [useLoved, setLovedState] = React.useState(JSON.parse(window.localStorage.getItem('useLovedMaps')) ?? false);
    const [askReprocess, setReprocessState] = React.useState(false);
    const [curFile, setFile] = React.useState(null);

    const handleLovedToggle = (event) => {
        window.localStorage.setItem('useLovedMaps', JSON.stringify(event.target.checked));
        setLovedState(event.target.checked);

        if (props.data.hasProcessedData) {
            setReprocessState(true);
        }
    }
    const handleScoresUpload = async (file) => {
        setFile(file);
        setReprocessState(false);
        await props.handleScoresUpload(file, useLoved);
    }

    return (
        <>
            <Box sx={props.sx}>
                <Paper sx={{ px: 5 }} alignItems="center" justifyContent="center" direction="column">
                    <Grid container>
                        <Grid item xs={12} md={6} lg={6}>
                            <Typography sx={{ mt: 2, mb: 1 }}>Upload the downloaded <code>scores.csv</code> file here:<br />
                                <FormControlLabel onChange={handleLovedToggle} control={<Switch defaultChecked={useLoved} />} label="Use loved scores" />
                                <Button startIcon={<InsertDriveFileIcon />} variant="contained" color="primary" component="label" disabled={props.loadState}>Upload scores<input onChange={e => handleScoresUpload(e.target.files[0])} hidden accept=".csv" type="file" /></Button>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            {
                                askReprocess ? <>
                                    <Alert severity="warning">
                                        <AlertTitle>Warning</AlertTitle>
                                        Changes require a reprocess
                                        <Button onClick={() => handleScoresUpload(curFile)} variant="contained" sx={{ ml: 2 }}>Reprocess</Button>
                                    </Alert>
                                </> : <></>
                            }
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </>
    );
}
export default FileSelector;