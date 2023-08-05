import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, CircularProgress, Grid, Link, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { GetAPI, readFileAsync, showNotification } from "../../Helpers/Misc";
import { OsuDb } from "../../Helpers/OsuDb/OsuDb";

const modeNames = {
    0: "Standard",
    1: "Taiko",
    2: "Catch the Beat",
    3: "Mania"
}

function ToolMissingBeatmaps() {
    const [beatmaps, setBeatmaps] = useState(null);
    const [readyToUpload, setReadyToUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [hasDataReady, setHasDataReady] = useState(false);
    const [processedData, setProcessedData] = useState(null);

    const uploadFile = async (e) => {
        if (uploading) return;

        setUploading(true);
        setHasDataReady(false);
        setProcessedData(null);

        const fileName = e.target.files[0].name;
        if (fileName !== "osu!.db") {
            showNotification("", "Invalid file name, expecting osu!.db", "error");
            setUploading(false);
            return;
        }

        const duplicatedModes = (JSON.parse(JSON.stringify(beatmaps)));

        const osuDbData = await readFileAsync(e.target.files[0]);

        const osuDb = new OsuDb();
        try {
            await osuDb.Read(osuDbData);
        } catch (err) {
            showNotification("", `Failed to read osu!.db file: ${err.message}`, "error");
            setUploading(false);
            return;
        }

        let missingModes = [];
        let existingIds = [];
        try {
            existingIds = osuDb.Beatmaps.map((beatmap) => beatmap.beatmapID);
        } catch (err) {
            showNotification("", `Failed to read osu!.db file: ${err.message}`, "error");
            setUploading(false);
            return;
        }

        for (let i = 0; i < duplicatedModes.length; i++) {
            let mode = duplicatedModes[i];
            let out = {};

            try {
                out.missingRanked = mode.ranked.filter((beatmap) => !existingIds.includes(beatmap.beatmap_id));
                out.missingLoved = mode.loved.filter((beatmap) => !existingIds.includes(beatmap.beatmap_id));
                out.missingRankedSets = [];
                out.missingLovedSets = [];

                for (let i = 0; i < out.missingRanked.length; i++) {
                    const beatmap = out.missingRanked[i];
                    const set = out.missingRankedSets.find((set) => set.set_id === beatmap.set_id);
                    if (set === undefined) {
                        out.missingRankedSets.push({
                            set_id: beatmap.set_id,
                            artist: beatmap.artist,
                            title: beatmap.title
                        });
                    }
                }

                for (let i = 0; i < out.missingLoved.length; i++) {
                    const beatmap = out.missingLoved[i];
                    const set = out.missingLovedSets.find((set) => set.set_id === beatmap.set_id);
                    if (set === undefined) {
                        out.missingLovedSets.push({
                            set_id: beatmap.set_id,
                            artist: beatmap.artist,
                            title: beatmap.title
                        });
                    }
                }

                missingModes.push(out);
            } catch (err) {
                showNotification("", `Failed to process beatmaps: ${err.message}`, "error");
                setUploading(false);
                return;
            }
        }

        console.log('missing beatmaps', missingModes);
        setProcessedData(missingModes);
        setUploading(false);
        setHasDataReady(true);
    };

    useEffect(() => {
        (async () => {
            if (beatmaps !== null && beatmaps.length > 0) return;
            //get beatmaps
            const { data } = await axios.get(`${GetAPI()}beatmaps/all?compact=1&include_loved=true&include_qualified=true&mode=0,1,2,3`);

            if (!data || data.error !== undefined || data.length === 0) {
                showNotification("", "Failed to get beatmaps", "error");
                return;
            }
            showNotification("", "Got beatmaps", "success");

            const modes = [];
            modes[0] = data.filter((beatmap) => beatmap.mode === 0);
            modes[1] = data.filter((beatmap) => beatmap.mode === 1);
            modes[2] = data.filter((beatmap) => beatmap.mode === 2);
            modes[3] = data.filter((beatmap) => beatmap.mode === 3);

            const _modes = [];

            for (let i = 0; i < modes.length; i++) {
                const mode = modes[i];
                const ranked = mode.filter((beatmap) => beatmap.approved === 1 || beatmap.approved === 2);
                const qualified = mode.filter((beatmap) => beatmap.approved === 3);
                const loved = mode.filter((beatmap) => beatmap.approved === 4);

                _modes[i] = {
                    ranked,
                    qualified,
                    loved,
                };
            }

            setBeatmaps(_modes);
            setReadyToUpload(true);

            // const ranked = data.filter((beatmap) => beatmap.approved === 1 || beatmap.approved === 2);
            // const qualified = data.filter((beatmap) => beatmap.approved === 3);
            // const loved = data.filter((beatmap) => beatmap.approved === 4);

            // setRankedBeatmaps(ranked);
            // setQualifiedBeatmaps(qualified);
            // setLovedBeatmaps(loved);
            // setBeatmaps(data);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Stack spacing={2}>
                <Alert severity="info">
                    Upload the <code>osu!.db</code> file that is inside your osu! installation folder
                </Alert>
                <Alert severity="warning">
                    Don't be alarmed if the web page freezes for a while. It takes longer to process larger files.
                </Alert>
                <Grid container spacing={1}>
                    {
                        beatmaps?.map((mode, index) => {
                            const total = mode?.ranked?.length + mode?.qualified?.length + mode?.loved?.length;
                            return (
                                <>
                                    <Grid item xs={4}>
                                        <Paper elevation={2} sx={{ p: 1 }}>
                                            <Typography variant="subtitle1">{modeNames[index]}</Typography>
                                            <Typography variant="h6">{total?.toLocaleString('en-US') ?? '-'}</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Paper elevation={2} sx={{ p: 1 }}>
                                            <Typography variant="subtitle1">Ranked</Typography>
                                            <Typography variant="h6">{mode?.ranked?.length?.toLocaleString('en-US') ?? '-'}</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Paper elevation={2} sx={{ p: 1 }}>
                                            <Typography variant="subtitle1">Loved</Typography>
                                            <Typography variant="h6">{mode?.loved?.length?.toLocaleString('en-US') ?? '-'}</Typography>
                                        </Paper>
                                    </Grid>
                                </>
                            )
                        })
                    }
                </Grid>
                <Button disable={!readyToUpload || uploading} variant="contained" component="label">
                    {
                        readyToUpload && !uploading ?
                            <>
                                Upload File <input type="file" hidden onChange={e => uploadFile(e)} />
                            </> : <>
                                <CircularProgress size={25} sx={{ color: "white" }} />
                            </>
                    }
                </Button>
                {
                    hasDataReady && <>
                        {
                            processedData?.map((mode, index) => {
                                return (
                                    <>
                                        <Paper elevation={2}>
                                            <Box sx={{m:1}}>
                                                <Typography variant="h5">{modeNames[index]}</Typography>
                                                <Grid container>
                                                    <Grid item xs={12 / 2}>
                                                        <Paper elevation={4} sx={{ p: 2, m: 1 }}>
                                                            <Typography variant="title" fontSize={'1em'}>Missing Ranked</Typography>
                                                            <Typography variant="h6">{mode?.missingRanked?.length?.toLocaleString('en-US') ?? '-'} ({mode?.missingRankedSets?.length?.toLocaleString('en-US') ?? '-'} sets)</Typography>
                                                        </Paper>
                                                    </Grid>
                                                    <Grid item xs={12 / 2}>
                                                        <Paper elevation={4} sx={{ p: 2, m: 1 }}>
                                                            <Typography variant="title" fontSize={'1em'}>Missing Loved</Typography>
                                                            <Typography variant="h6">{mode?.missingLoved?.length?.toLocaleString('en-US') ?? '-'} ({mode?.missingLovedSets?.length?.toLocaleString('en-US') ?? '-'} sets)</Typography>
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            <Box>
                                                <Accordion>
                                                    <AccordionSummary>
                                                        <Typography>Ranked</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <TableContainer component={Paper}>
                                                            <Table size='small'>
                                                                <TableBody>
                                                                    {
                                                                        mode?.missingRankedSets?.map((set) => (
                                                                            <TableRow key={set.set_id}>
                                                                                <TableCell>{set.set_id}</TableCell>
                                                                                <TableCell>{set.artist} - {set.title}</TableCell>
                                                                                <TableCell><Link href={`https://osu.ppy.sh/beatmapsets/${set.set_id}`} target='_blank'>osu!</Link></TableCell>
                                                                                <TableCell><Link href={`osu://dl/${set.set_id}`} target='_blank'>osu!direct</Link></TableCell>
                                                                            </TableRow>
                                                                        ))
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </AccordionDetails>
                                                </Accordion>
                                                <Accordion>
                                                    <AccordionSummary>
                                                        <Typography>Loved</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <TableContainer component={Paper}>
                                                            <Table size='small'>
                                                                <TableBody>
                                                                    {
                                                                        mode?.missingLovedSets?.map((set) => (
                                                                            <TableRow key={set.set_id}>
                                                                                <TableCell>{set.set_id}</TableCell>
                                                                                <TableCell>{set.artist} - {set.title}</TableCell>
                                                                                <TableCell><Link href={`https://osu.ppy.sh/beatmapsets/${set.set_id}`} target='_blank'>osu!</Link></TableCell>
                                                                                <TableCell><Link href={`osu://dl/${set.set_id}`} target='_blank'>osu!direct</Link></TableCell>
                                                                            </TableRow>
                                                                        ))
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </Box>
                                        </Paper>
                                    </>
                                )
                            })
                        }
                    </>
                }
            </Stack >
        </>
    );
}

export default ToolMissingBeatmaps;