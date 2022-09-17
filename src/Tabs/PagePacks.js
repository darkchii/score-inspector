import { Accordion, AccordionDetails, AccordionSummary, Box, Button, ButtonGroup, Card, CardContent, Chip, Grid, LinearProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getBeatmapPackMaps } from "../osu";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ScoreModal from "../Components/ScoreModal";

const chunkSize = 50;
function PagePacks(props) {
    const [packChunks, setPackChunks] = useState([]);
    const [selectedPack, setSelectedPack] = useState(null);
    const [isWorking, setWorkingState] = useState(false);
    const [modalData, setModalData] = useState({ active: false });

    useEffect(() => {
        const chunks = [];
        for (let i = 0; i < props.data.processed.beatmap_packs.individual.length; i += chunkSize) {
            const chunk = props.data.processed.beatmap_packs.individual.slice(i, i + chunkSize);
            chunks.push(chunk);
        }

        setPackChunks(chunks);
    }, []);

    const loadPack = async (pack) => {
        setSelectedPack(null);
        setWorkingState(true);
        const maps = await getBeatmapPackMaps(pack.name.toUpperCase(), false);
        if (maps !== null) {
            pack.beatmaps = maps;
            pack.beatmaps.sort((a, b) => a.star_rating - b.star_rating);
            pack.beatmaps.forEach((map, index) => {
                console.log(map.beatmap_id);
                pack.beatmaps[index].cleared = props.data.scores.findIndex((score) => parseInt(score.beatmap_id) === parseInt(map.beatmap_id)) !== -1;
            });
        }
        setWorkingState(false);
        setSelectedPack(pack);
    };

    return (
        <>
            <ScoreModal data={modalData} />
            <Card>
                <CardContent>
                    <Typography variant='h5'>Beatmap pack completion</Typography>
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                {
                                    packChunks.map((chunk, i) => (
                                        <>
                                            <Accordion TransitionProps={{ unmountOnExit: true }}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography>{i * chunkSize} - {(i + 1) * chunkSize}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Stack direction='column' spacing={0.5}>
                                                        {
                                                            chunk.map((pack) => <>
                                                                <Stack>
                                                                    <Button variant={selectedPack !== null && selectedPack.name === pack.name ? 'contained' : 'outlined'} disabled={isWorking} onClick={() => { loadPack(pack) }} size='small'>
                                                                        <Grid container>
                                                                            <Grid item xs={4}>
                                                                                <Typography align='left'>{pack.name}</Typography>
                                                                            </Grid>
                                                                            <Grid item xs={2}>
                                                                                <Typography align='right'>{pack.cleared}</Typography>
                                                                            </Grid>
                                                                            <Grid item xs={2}>
                                                                                <Typography align='left'>/{pack.count}</Typography>
                                                                            </Grid>
                                                                            <Grid item xs={4}>
                                                                                <Typography align='right'>{(100 / pack.count * pack.cleared).toFixed(2)}%</Typography>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Button>
                                                                    <LinearProgress sx={{ height: '10px' }} variant='determinate' value={100 / pack.count * pack.cleared} />
                                                                </Stack>
                                                            </>)
                                                        }
                                                    </Stack>
                                                </AccordionDetails>
                                            </Accordion>
                                        </>
                                    ))
                                }
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2 }}>
                                    {
                                        selectedPack ? (
                                            selectedPack.beatmaps !== undefined ? <>
                                                <Typography variant='h6'>Beatmap pack: {selectedPack.name}</Typography>
                                                <Button variant='contained' href={`https://osu.ppy.sh/beatmaps/packs/${selectedPack.name}`} target='_blank'>View on osu! website</Button>
                                                <TableContainer>
                                                    <Table size='small'>
                                                        <TableBody>
                                                            {
                                                                selectedPack.beatmaps.map((map) => (
                                                                    <TableRow sx={{ maxHeight: '20px' }}>
                                                                        <TableCell sx={{ width: '5%' }}>
                                                                            {
                                                                                map.cleared ? <CheckCircleIcon color='success' /> : <CancelIcon color='error' />
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell sx={{ width: '5%' }}>
                                                                            <Typography>{map.star_rating.toFixed(2)}*</Typography>
                                                                        </TableCell>
                                                                        <TableCell sx={{ width: '60%' }}>
                                                                            <Typography>{map.artist} - {map.title} [{map.version}]</Typography>
                                                                        </TableCell>
                                                                        <TableCell sx={{ width: '30%' }}>
                                                                            <ButtonGroup size='small'>
                                                                                <Button href={`https://osu.ppy.sh/beatmaps/${map.beatmap_id}`} target='_blank'>Website</Button>
                                                                                <Button href={`osu://b/${map.beatmap_id}`}>Direct</Button>
                                                                                {
                                                                                    map.cleared ? <>
                                                                                        <Button onClick={() => {
                                                                                            setModalData({
                                                                                                active: true,
                                                                                                score: props.data.scores.find(score => parseInt(score.beatmap_id) === parseInt(map.beatmap_id))
                                                                                            })
                                                                                        }}>Show</Button>
                                                                                    </> : <></>
                                                                                }
                                                                            </ButtonGroup>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            }
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </> : <>
                                                <Typography>Unable to get beatmap data</Typography>
                                            </>
                                        ) : <>
                                            <Typography>No pack selected</Typography>
                                        </>
                                    }
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </>
    );
}
export default PagePacks;