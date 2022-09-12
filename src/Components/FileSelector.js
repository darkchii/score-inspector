import { Alert, AlertTitle, Box, Button, Card, CardContent, FormControlLabel, Grid, Step, StepLabel, Stepper, Switch, Typography } from "@mui/material";
import React from "react";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

function FileSelector(props) {
    const [stepperActiveStep, setStepperActiveStep] = React.useState(0);
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

    const stepperHandleBack = () => {
        setStepperActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const stepperHandleNext = () => {
        setStepperActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleScoresUpload = async (file) => {
        setFile(file);
        setReprocessState(false);
        await props.handleScoresUpload(file, useLoved);
    }

    return (
        <>
            <Card sx={props.sx}>
                <CardContent>
                    <Box>
                        <Stepper activeStep={stepperActiveStep}>
                            <Step key="s1">
                                <StepLabel>Join Discord</StepLabel>
                            </Step>
                            <Step key="s2">
                                <StepLabel>Fetch Scores</StepLabel>
                            </Step>
                            <Step key="s3">
                                <StepLabel>Download Scores</StepLabel>
                            </Step>
                            <Step key="s4">
                                <StepLabel>Upload</StepLabel>
                            </Step>
                        </Stepper>
                        <Typography sx={{ mt: 2, mb: 1 }}>Step {stepperActiveStep + 1}</Typography>
                        <Box sx={{ px: 5 }} alignItems="center" justifyContent="center" direction="column">
                            {
                                {
                                    0: <><Typography sx={{ mt: 2, mb: 1 }}>Join the following discord: <Button href='https://discord.gg/VZWRZZXcW4' target="_blank" variant="contained" size='small'>osu!alternative</Button></Typography></>,
                                    1: <><Typography sx={{ mt: 2, mb: 1 }}>Go to the #info text-channel, and do what the section "Fetching scores" says.<br />It can take a couple of hours to get all of your scores ready, depending on your stats.</Typography></>,
                                    2: <><Typography sx={{ mt: 2, mb: 1 }}>To get your file, go to #bot-channel and perform the following command: <br /><code>!getfile -type scores -u username</code> - Replace username with yours. You will receive a <code>scores.csv</code> file.</Typography></>,
                                    3: <>
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
                                                            <Button onClick={()=>handleScoresUpload(curFile)} variant="contained" sx={{ml:2}}>Reprocess</Button>
                                                        </Alert>
                                                    </> : <></>
                                                }
                                            </Grid>
                                        </Grid>
                                    </>,
                                }[stepperActiveStep]
                            }
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                                color="inherit"
                                disabled={stepperActiveStep === 0}
                                onClick={stepperHandleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            {
                                stepperActiveStep < 3 ?
                                    <Button onClick={stepperHandleNext}>Next</Button>
                                    : <></>
                            }
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </>
    );
}
export default FileSelector;