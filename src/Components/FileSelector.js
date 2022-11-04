import { Alert, AlertTitle, Autocomplete, Box, Button, Card, CardContent, Chip, FormControlLabel, FormGroup, Grid, Link, Paper, Step, StepLabel, Stepper, Switch, TextField, Typography } from "@mui/material";
import React from "react";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { getRegisteredUsers } from "../osu";

function FileSelector(props) {
    const [useLoved, setLovedState] = React.useState(JSON.parse(window.localStorage.getItem('useLovedMaps')) ?? false);
    const [askReprocess, setReprocessState] = React.useState(false);
    const [curUsername, setUsername] = React.useState(null);
    const [isWorking, setWorkingState] = React.useState(false);
    const usernameRef = React.useRef(null);
    const [usersAutoComplete, setUsersAutoComplete] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            if (props.data.persistentData.registeredUsers === null || props.data.persistentData.registeredUsers === undefined) {
                const users = await getRegisteredUsers();
                props.data.persistentData.registeredUsers = users;
            }
            setUsersAutoComplete(props.data.persistentData.registeredUsers);
        })();
    }, []);

    const handleLovedToggle = (event) => {
        window.localStorage.setItem('useLovedMaps', JSON.stringify(event.target.checked));
        setLovedState(event.target.checked);

        if (props.data.hasProcessedData) {
            setReprocessState(true);
        }
    }

    const handleScoresFetch = async (username) => {
        setUsername(username);
        setReprocessState(false);
        setWorkingState(true);
        await props.handleScoresFetch(username, useLoved);
        setWorkingState(false);
    }

    // const handleScoresUpload = async (file) => {
    //     setFile(file);
    //     setReprocessState(false);
    //     await props.handleScoresUpload(file, useLoved);
    // }

    return (
        <>
            <Box sx={props.sx}>
                <Box sx={{ pl: 5 }} alignItems="center" justifyContent="center" direction="column">
                    <Grid container>
                        <Grid item xs={12} md={6} lg={6}>
                            <FormGroup sx={{ m: 1 }} row={true}>
                                <Autocomplete
                                    sx={{ width: '200px', pr: 1 }}
                                    freeSolo
                                    options={usersAutoComplete}
                                    autoHighlight
                                    getOptionLabel={(option) => option.username}
                                    renderOption={(props, option) => (
                                        <Link {...props}>
                                            <Chip sx={{ backgroundColor: 'background.default', textDecoration: 'none !important' }} label={option.username} />
                                        </Link>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            disabled={isWorking}
                                            {...params}
                                            inputRef={usernameRef}
                                            size='small'
                                            variant="standard"
                                            label="Username" />
                                    )} />
                                <Button disabled={isWorking} size='small' variant="contained" color="primary" onClick={(e) => handleScoresFetch(usernameRef.current.value)}>Fetch scores</Button>
                            </FormGroup>
                            <FormControlLabel disabled={isWorking} onChange={handleLovedToggle} control={<Switch defaultChecked={useLoved} />} label="Use loved scores" />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sx={{ minHeight: '100%' }}>
                            {
                                askReprocess ? <>
                                    <Alert sx={{ minHeight: '100%' }} severity="warning">
                                        <AlertTitle>Warning</AlertTitle>
                                        Changes require a reprocess
                                        <Button onClick={() => handleScoresFetch(curUsername)} variant="contained" sx={{ ml: 2 }}>Reprocess</Button>
                                    </Alert>
                                </> : <></>
                            }
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
}
export default FileSelector;