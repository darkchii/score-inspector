import { Box, Button, Grid2, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { showNotification } from "../../Helpers/Misc";

function ToolScoreRank() {
    const [rankToScoreInput, setRankToScoreInput] = useState(undefined);
    const [rankToScoreOutput, setRankToScoreOutput] = useState(undefined);
    const [working, setWorking] = useState(false);

    const calcRankToScore = async () => {
        if (!rankToScoreInput) {
            showNotification('Incomplete fields', 'Please fill in all fields', 'error');
            return;
        }

        const rank = parseInt(rankToScoreInput);
        if (isNaN(rank)) {
            showNotification('Invalid rank', 'The specified rank is not a number', 'error');
            return;
        }

        if (rank < 1 || rank > 10000) {
            showNotification('Invalid rank', 'This only works for ranks between 1 and 10.000', 'error');
            return;
        }

        setWorking(true);
        try {
            const { data } = await axios.get(`https://score.respektive.pw/rank/${rank}?m=0`);
            setRankToScoreOutput(data[0].score + 1);
        } catch (e) {
            showNotification('Error', 'An unknown error occured', 'error');
        }

        setWorking(false);
    };

    return (
        <>
            <Stack spacing={2}>
                <Box component={Paper} sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <Typography variant="h6">Get current score needed for specific rank</Typography>
                        <Grid2 container>
                            <Grid2 size={3}>
                            </Grid2>
                            <Grid2 size={6}>
                                <Stack spacing={1}>
                                    <TextField disabled={working} value={rankToScoreInput} onChange={e => setRankToScoreInput(e.target.value)} label="Rank" variant="standard" size='small' />
                                    <Button onClick={() => calcRankToScore()} disabled={working} variant="contained" size='small'>Process</Button>
                                </Stack >
                            </Grid2>
                            <Grid2 size={3}>
                            </Grid2>
                        </Grid2>
                        <Typography variant="h6">Needed score: {rankToScoreOutput ? rankToScoreOutput.toLocaleString('en-US') : '-'}</Typography>
                        <Typography variant="body2">This will give you the required score needed for a specific score rank</Typography>
                    </Stack>
                </Box>
            </Stack >
        </>
    );
}

export default ToolScoreRank;