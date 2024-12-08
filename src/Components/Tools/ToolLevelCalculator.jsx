import { Box, Button, Grid2, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { showNotification } from "../../Helpers/Misc";
import { getLevelForScore, getScoreForLevel, getUser } from "../../Helpers/Osu";

function ToolLevelCalculator() {
    const [userCalcNameInput, setUserCalcNameInput] = useState(undefined);
    const [userCalcLevelInput, setUserCalcLevelInput] = useState(undefined);
    const [userCalcResult, setUserCalcResult] = useState(null);

    const [leveltoScoreCalcInput, setLevelToScoreCalcInput] = useState(undefined);
    const [leveltoScoreCalcResult, setLeveltoScoreCalcResult] = useState(null);

    const [scoreToLevelCalcInput, setScoreToLevelCalcInput] = useState(undefined);
    const [scoreToLevelCalcResult, setScoreToLevelCalcResult] = useState(null);

    const [working, setWorking] = useState(false);

    const calculateUserLevel = async () => {
        if (!userCalcNameInput || !userCalcLevelInput) {
            showNotification('Incomplete fields', 'Please fill in all fields', 'error');
            return;
        }

        setWorking(true);
        (async () => {
            try {
                const user = await getUser(userCalcNameInput);
                if (user === null) {
                    showNotification('User not found', 'The specified user was not found', 'error');
                    setWorking(false);
                    return;
                }

                const userScore = user.statistics.total_score;
                const requiredScore = getScoreForLevel(userCalcLevelInput);
                const scoreNeeded = requiredScore - userScore;
                setUserCalcResult(scoreNeeded);
            } catch (err) {
                showNotification('Error', 'An unknown error occurred while calculating', 'error');
            }
            setWorking(false);
        })();
    }

    const calculateLevelToScore = () => {
        if (!leveltoScoreCalcInput) {
            showNotification('Incomplete fields', 'Please fill in all fields', 'error');
            return;
        }

        setWorking(true);
        try {
            const requiredScore = getScoreForLevel(leveltoScoreCalcInput);
            setLeveltoScoreCalcResult(requiredScore);
        } catch (err) {
            showNotification('Error', 'An unknown error occured while calculating', 'error');
        }
        setWorking(false);
    }

    const calculateScoreToLevel = () => {
        if (!scoreToLevelCalcInput) {
            showNotification('Incomplete fields', 'Please fill in all fields', 'error');
            return;
        }

        setWorking(true);
        try {
            const _score = parseInt(scoreToLevelCalcInput);
            const levelRes = getLevelForScore(_score);
            setScoreToLevelCalcResult(levelRes);
        } catch (err) {
            showNotification('Error', 'An unknown error occured while calculating', 'error');
        }
        setWorking(false);
    }

    return (
        <>
            <Stack spacing={2}>
                <Box component={Paper} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6">Calculate for user</Typography>
                        <Grid2 container>
                            <Grid2 size={3}>
                            </Grid2>
                            <Grid2 size={6}>
                                <Stack spacing={1}>
                                    <TextField disabled={working} value={userCalcNameInput} onChange={e => setUserCalcNameInput(e.target.value)} label="Username" variant="standard" size='small' />
                                    <TextField disabled={working} value={userCalcLevelInput} onChange={e => setUserCalcLevelInput(e.target.value)} label="Level" variant="standard" size='small' />
                                    <Button onClick={() => calculateUserLevel()} disabled={working} variant="contained" size='small'>Calculate</Button>
                                </Stack >
                            </Grid2>
                            <Grid2 size={3}>
                            </Grid2>
                        </Grid2>
                        <Typography variant="h6">Score needed: {userCalcResult ? userCalcResult.toLocaleString('en-US') : '-'}</Typography>
                        <Typography variant="body2">This will calculate the amount of score needed to reach the specified level.</Typography>
                    </Stack>
                </Box>

                <Box component={Paper} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6">Calculate level to score</Typography>
                        <Grid2 container>
                            <Grid2 size={3}>
                            </Grid2>
                            <Grid2 size={6}>
                                <Stack spacing={1}>
                                    <TextField disabled={working} value={leveltoScoreCalcInput} onChange={e => setLevelToScoreCalcInput(e.target.value)} label="Level" variant="standard" size='small' />
                                    <Button onClick={() => calculateLevelToScore()} disabled={working} variant="contained" size='small'>Calculate</Button>
                                </Stack >
                            </Grid2>
                            <Grid2 size={3}>
                            </Grid2>
                        </Grid2>
                        <Typography variant="h6">Score needed: {leveltoScoreCalcResult ? leveltoScoreCalcResult.toLocaleString('en-US') : '-'}</Typography>
                        <Typography variant="body2">This will calculate the amount of score needed to reach the specified level.</Typography>
                    </Stack>
                </Box>

                <Box component={Paper} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6">Calculate score to level</Typography>
                        <Grid2 container>
                            <Grid2 size={3}>
                            </Grid2>
                            <Grid2 size={6}>
                                <Stack spacing={1}>
                                    <TextField disabled={working} value={scoreToLevelCalcInput} onChange={e => setScoreToLevelCalcInput(e.target.value)} label="Score" variant="standard" size='small' />
                                    <Button onClick={() => calculateScoreToLevel()} disabled={working} variant="contained" size='small'>Calculate</Button>
                                </Stack >
                            </Grid2>
                            <Grid2 size={3}>
                            </Grid2>
                        </Grid2>
                        <Typography variant="h6">Resulting level: {scoreToLevelCalcResult ? scoreToLevelCalcResult.toLocaleString('en-US') : '-'}</Typography>
                        <Typography variant="body2">This will calculate the level resulting from x score</Typography>
                    </Stack>
                </Box>
            </Stack >
        </>
    );
}

export default ToolLevelCalculator;