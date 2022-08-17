import { Box, Button, Card, CardContent, Grid, Link, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import React from "react";

function FileSelector(props) {
    const [stepperActiveStep, setStepperActiveStep] = React.useState(0);
    const [stepperCompleted, setStepperCompleted] = React.useState({});
  
    const stepperHandleBack = () => {
      setStepperActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    const stepperHandleNext = () => {
      setStepperActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const stepperHandleReset = () => {
      setStepperActiveStep(0);
    };

    const handleScoresUpload = async (file) => {
        await props.handleScoresUpload(file);
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
                                    3: <><Typography sx={{ mt: 2, mb: 1 }}>Upload the downloaded <code>scores.csv</code> file here:<br /><Button variant="contained" color="primary" component="label" disabled={props.loadState}>Upload scores<input onChange={e => handleScoresUpload(e.target.files[0])} hidden accept=".csv" type="file" /></Button></Typography></>,
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