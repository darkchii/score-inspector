import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, CircularProgress, Grid, Link, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { GetAPI, readFileAsync, showNotification } from "../../Helpers/Misc";
import { OsuDb } from "../../Helpers/OsuDb/OsuDb";

function ToolMissingBeatmaps() {
    const [beatmaps, setBeatmaps] = useState(null);
    const [rankedBeatmaps, setRankedBeatmaps] = useState(null);
    const [qualifiedBeatmaps, setQualifiedBeatmaps] = useState(null);
    const [lovedBeatmaps, setLovedBeatmaps] = useState(null);
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
        const duplicateRankedBeatmaps = (JSON.parse(JSON.stringify(rankedBeatmaps)));
        const duplicateQualifiedBeatmaps = (JSON.parse(JSON.stringify(qualifiedBeatmaps)));
        const duplicateLovedBeatmaps = (JSON.parse(JSON.stringify(lovedBeatmaps)));
        const osuDbData = await readFileAsync(e.target.files[0]);

        const osuDb = new OsuDb();
        try {
            await osuDb.Read(osuDbData);
        } catch (e) {
            showNotification("", "Failed to read osu!.db file", "error");
            setUploading(false);
            return;
        }

        let missingRanked;
        let missingQualified;
        let missingLoved;
        let missingRankedSets = [];
        let missingQualifiedSets = [];
        let missingLovedSets = [];
        try {
            const existingIds = osuDb.Beatmaps.map((beatmap) => beatmap.beatmapID);

            missingRanked = duplicateRankedBeatmaps.filter((beatmap) => !existingIds.includes(beatmap.beatmap_id));
            missingQualified = duplicateQualifiedBeatmaps.filter((beatmap) => !existingIds.includes(beatmap.beatmap_id));
            missingLoved = duplicateLovedBeatmaps.filter((beatmap) => !existingIds.includes(beatmap.beatmap_id));

            for (let i = 0; i < missingRanked.length; i++) {
                const beatmap = missingRanked[i];
                const set = missingRankedSets.find((set) => set.beatmapset_id === beatmap.beatmapset_id);
                if (set === undefined) {
                    missingRankedSets.push({
                        beatmapset_id: beatmap.beatmapset_id,
                        artist: beatmap.artist,
                        title: beatmap.title
                    });
                }
            }

            for (let i = 0; i < missingQualified.length; i++) {
                const beatmap = missingQualified[i];
                const set = missingQualifiedSets.find((set) => set.beatmapset_id === beatmap.beatmapset_id);
                if (set === undefined) {
                    missingQualifiedSets.push({
                        beatmapset_id: beatmap.beatmapset_id,
                        artist: beatmap.artist,
                        title: beatmap.title
                    });
                }
            }

            for (let i = 0; i < missingLoved.length; i++) {
                const beatmap = missingLoved[i];
                const set = missingLovedSets.find((set) => set.beatmapset_id === beatmap.beatmapset_id);
                if (set === undefined) {
                    missingLovedSets.push({
                        beatmapset_id: beatmap.beatmapset_id,
                        artist: beatmap.artist,
                        title: beatmap.title
                    });
                }
            }
        } catch (e) {
            showNotification("", "Failed to process data", "error");
            setUploading(false);
            return;
        }

        const data = {
            missingRanked,
            missingQualified,
            missingLoved,
            missingRankedSets,
            missingQualifiedSets,
            missingLovedSets,
        };
        setProcessedData(data);

        setUploading(false);
        setHasDataReady(true);
    };

    useEffect(() => {
        (async () => {
            if (beatmaps !== null && beatmaps.length > 0) return;
            //get beatmaps
            const { data } = await axios.get(`${GetAPI()}beatmaps/all?compact=1&include_loved=true&include_qualified=true`);

            if (!data || data.error !== undefined || data.length === 0) {
                showNotification("", "Failed to get beatmaps", "error");
                return;
            }
            showNotification("", "Got beatmaps", "success");

            const ranked = data.filter((beatmap) => beatmap.approved === 1 || beatmap.approved === 2);
            const qualified = data.filter((beatmap) => beatmap.approved === 3);
            const loved = data.filter((beatmap) => beatmap.approved === 4);

            setRankedBeatmaps(ranked);
            setQualifiedBeatmaps(qualified);
            setLovedBeatmaps(loved);
            setBeatmaps(data);
            setReadyToUpload(true);
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
                <Grid container>
                    <Grid item xs={3}>
                        <Paper elevation={2} sx={{ p: 2, m: 1 }}>
                            <Typography variant="title">Total</Typography>
                            <Typography variant="h6">{beatmaps?.length?.toLocaleString('en-US') ?? '-'}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper elevation={2} sx={{ p: 2, m: 1 }}>
                            <Typography variant="title">Ranked</Typography>
                            <Typography variant="h6">{rankedBeatmaps?.length?.toLocaleString('en-US') ?? '-'}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper elevation={2} sx={{ p: 2, m: 1 }}>
                            <Typography variant="title">Qualified</Typography>
                            <Typography variant="h6">{qualifiedBeatmaps?.length?.toLocaleString('en-US') ?? '-'}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper elevation={2} sx={{ p: 2, m: 1 }}>
                            <Typography variant="title">Loved</Typography>
                            <Typography variant="h6">{lovedBeatmaps?.length?.toLocaleString('en-US') ?? '-'}</Typography>
                        </Paper>
                    </Grid>
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
                        <Grid container>
                            <Grid item xs={12 / 3}>
                                <Paper elevation={2} sx={{ p: 2, m: 1 }}>
                                    <Typography variant="title" fontSize={'1em'}>Missing Ranked</Typography>
                                    <Typography variant="h6">{processedData?.missingRanked?.length?.toLocaleString('en-US') ?? '-'} ({processedData?.missingRankedSets?.length?.toLocaleString('en-US') ?? '-'} sets)</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12 / 3}>
                                <Paper elevation={2} sx={{ p: 2, m: 1 }}>
                                    <Typography variant="title" fontSize={'1em'}>Missing Qualified</Typography>
                                    <Typography variant="h6">{processedData?.missingQualified?.length?.toLocaleString('en-US') ?? '-'} ({processedData?.missingQualifiedSets?.length?.toLocaleString('en-US') ?? '-'} sets)</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12 / 3}>
                                <Paper elevation={2} sx={{ p: 2, m: 1 }}>
                                    <Typography variant="title" fontSize={'1em'}>Missing Loved</Typography>
                                    <Typography variant="h6">{processedData?.missingLoved?.length?.toLocaleString('en-US') ?? '-'} ({processedData?.missingLovedSets?.length?.toLocaleString('en-US') ?? '-'} sets)</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
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
                                                    processedData?.missingRankedSets?.map((set) => (
                                                        <TableRow key={set.beatmapset_id}>
                                                            <TableCell>{set.beatmapset_id}</TableCell>
                                                            <TableCell>{set.artist} - {set.title}</TableCell>
                                                            <TableCell><Link href={`https://osu.ppy.sh/beatmapsets/${set.beatmapset_id}`} target='_blank'>osu!</Link></TableCell>
                                                            <TableCell><Link href={`osu://dl/${set.beatmapset_id}`} target='_blank'>osu!direct</Link></TableCell>
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
                                    <Typography>Qualified</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer component={Paper}>
                                        <Table size='small'>
                                            <TableBody>
                                                {
                                                    processedData?.missingQualifiedSets?.map((set) => (
                                                        <TableRow key={set.beatmapset_id}>
                                                            <TableCell>{set.beatmapset_id}</TableCell>
                                                            <TableCell>{set.artist} - {set.title}</TableCell>
                                                            <TableCell><Link href={`https://osu.ppy.sh/beatmapsets/${set.beatmapset_id}`} target='_blank'>osu!</Link></TableCell>
                                                            <TableCell><Link href={`osu://dl/${set.beatmapset_id}`} target='_blank'>osu!direct</Link></TableCell>
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
                                                    processedData?.missingLovedSets?.map((set) => (
                                                        <TableRow key={set.beatmapset_id}>
                                                            <TableCell>{set.beatmapset_id}</TableCell>
                                                            <TableCell>{set.artist} - {set.title}</TableCell>
                                                            <TableCell><Link href={`https://osu.ppy.sh/beatmapsets/${set.beatmapset_id}`} target='_blank'>osu!</Link></TableCell>
                                                            <TableCell><Link href={`osu://dl/${set.beatmapset_id}`} target='_blank'>osu!direct</Link></TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </>
                }
            </Stack >
        </>
    );
}

export default ToolMissingBeatmaps;