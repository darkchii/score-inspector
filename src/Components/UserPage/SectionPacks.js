import { useEffect } from "react";
import { useState } from "react";
import { getBeatmapPacks } from "../../Helpers/Osu";
import { Accordion, Box, Button, ButtonGroup, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import GlowBar from "../UI/GlowBar";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const PACK_GROUP_SIZE = 100;

function SectionPacks(props) {
    const [selectedPackType, setSelectedPackType] = useState(0);
    const [packData, setPackData] = useState([]);
    const packTypes = [
        {
            name: 'Default',
            identifier: ['S', 'SC', 'ST', 'SM']
        },
        {
            name: 'Loved',
            identifier: ['SL']
        },
        {
            name: 'Approved',
            identifier: ['SA']
        },
        {
            name: 'Spotlights',
            identifier: ['R']
        },
        {
            name: 'Theme',
            identifier: ['T']
        },
        {
            name: 'Artist',
            identifier: ['A']
        },
        {
            name: 'Tournaments',
            identifier: ['P']
        },
        {
            name: 'osu!dan',
            identifier: ['TC']
        },
        {
            name: 'Unsorted',
            identifier: ''
        }
    ];

    useEffect(() => {
        (async () => {
            const data = await getBeatmapPacks();

            if (data) {
                //remove non-std packs ('SC', 'ST', 'SM', keep 'S')
                let _data = data.filter(pack => {
                    let pack_type = pack.pack_id.replace(/[0-9]/g, '');
                    return pack_type !== 'SC' && pack_type !== 'ST' && pack_type !== 'SM';
                });


                //count the types
                _data.forEach(pack => {
                    let pack_type = pack.pack_id.replace(/[0-9]/g, '');

                    let identified = false;
                    packTypes.forEach(type => {
                        if (type.identifier.includes(pack_type)) {
                            type.total = (type.total || 0) + 1;
                            identified = true;
                        }
                    });

                    if (!identified) {
                        console.log("unidentified pack type", pack.pack_id);
                        packTypes[packTypes.length - 1].total = (packTypes[packTypes.length - 1].total || 0) + 1;
                    }
                });

                let _packData = {};

                data.forEach(row => {
                    let key = row.pack_id;
                    _packData[key] = {
                        name: key,
                        sortName: parseInt(key.replace(/\D/g, '')),
                        total: parseInt(row.count ?? 0),
                        played: []
                    }
                });

                props.user.scores.forEach(score => {
                    if (score.beatmap === undefined) {
                        console.log("undefined beatmap", score);
                    } else {
                        let pack_ids = score.beatmap.packs?.map(pack => pack.pack_id) ?? [];
                        pack_ids.forEach(pack_id => {
                            if (pack_id && _packData[pack_id]) {
                                if (!_packData[pack_id].played.includes(score.beatmap_id)) {
                                    _packData[pack_id].played.push(score.beatmap_id);
                                }
                            }
                        });
                    }
                });

                let data_arr = [];
                for (let key in _packData) {
                    data_arr.push(_packData[key]);
                }

                data_arr.sort((a, b) => {
                    return a.sortName - b.sortName;
                });

                //move each pack to the correct type
                data_arr.forEach(pack => {
                    let pack_type = pack.name.replace(/[0-9]/g, '');

                    let identified = false;
                    packTypes.forEach(type => {
                        if (type.identifier.includes(pack_type)) {
                            type.packs = type.packs || [];
                            type.packs.push(pack);
                            identified = true;
                        }
                    });

                    if (!identified) {
                        console.log("unidentified pack type", pack.name);
                        packTypes[packTypes.length - 1].packs = packTypes[packTypes.length - 1].packs || [];
                        packTypes[packTypes.length - 1].packs.push(pack);
                    }
                });

                //split packtype packs into groups of 100
                packTypes.forEach(type => {
                    if (type.packs) {
                        let packCount = type.packs.length;
                        let packSets = Math.ceil(packCount / PACK_GROUP_SIZE);

                        let groupedPacks = [];
                        for (let i = 0; i < packSets; i++) {
                            let offset = i * PACK_GROUP_SIZE;
                            //cant use slice
                            let packSet = [];
                            let packTotal = 0;
                            let packPlayed = 0;
                            for (let j = 0; j < PACK_GROUP_SIZE; j++) {
                                if (type.packs[offset + j]) {
                                    packTotal += type.packs[offset + j].total;
                                    packPlayed += type.packs[offset + j].played.length;
                                    packSet.push(type.packs[offset + j]);
                                }
                            }
                            groupedPacks.push({
                                packs: packSet,
                                total: packTotal,
                                played: packPlayed
                            });
                        }
                        type.groupedPacks = groupedPacks;
                    }
                });

                setPackData(packTypes);
            }
        })();
    }, []);

    useEffect(() => {
        console.log(packData?.[selectedPackType]);
    }, [selectedPackType]);

    return (
        <>
            <Grid sx={{ p: 2 }}>
                <Grid sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <ButtonGroup variant='contained' color='primary'>
                        {
                            packTypes.map((type, i) => {
                                return (
                                    <Button
                                        onClick={() => setSelectedPackType(i)}
                                        variant={selectedPackType === i ? 'contained' : 'outlined'}>{type.name}</Button>
                                )
                            })
                        }
                    </ButtonGroup>
                </Grid>
                <Grid sx={{pt: 1}}>
                    <Box>
                        {
                            packData && packData?.[selectedPackType]?.groupedPacks ? packData?.[selectedPackType]?.groupedPacks.map((groupedPack, i) => {
                                return (
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>Packs {i * PACK_GROUP_SIZE + 1} - {i * PACK_GROUP_SIZE + groupedPack.packs.length}</Typography>
                                            <Typography sx={{ width: '33%', textAlign: 'right', pr: '1rem' }}>{Math.ceil(100 / groupedPack.total * groupedPack.played)}%</Typography>
                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                <Box sx={{ width: '100%', height: '100%' }}>
                                                    <LinearProgress sx={{ height: '100%', borderRadius: '10px' }} variant='determinate' value={groupedPack.played / groupedPack.total * 100} />
                                                </Box>
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container spacing={1}>
                                                {
                                                    groupedPack.packs.map(pack => {
                                                        return (
                                                            <Grid item xs={12 / 4}>
                                                                <Paper elevation={2} sx={{ height: '100%', position: 'relative', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                                                                    <Stack direction='column'>
                                                                        <Box sx={{ p: 0.5, pb: 0, position: 'relative' }}>
                                                                            <Typography variant='subtitles1' sx={{ float: 'left' }}>{pack.name} ({pack.played.length}/{pack.total})</Typography>
                                                                            <Typography variant='subtitles1' sx={{ float: 'right' }}>{Math.round(pack.played.length / pack.total * 100)}%</Typography>
                                                                        </Box>
                                                                        <Box sx={{ width: '100%', position: 'relative', top: '1px' }}>
                                                                            <LinearProgress sx={{ height: '6px' }} variant='determinate' value={pack.played.length / pack.total * 100} />
                                                                        </Box>
                                                                    </Stack>
                                                                </Paper>
                                                            </Grid>
                                                        )
                                                    })
                                                }
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                )
                            }) : <></>
                        }
                    </Box>
                </Grid>
            </Grid>
            {/* <Grid container spacing={0.5}>
                {
                    packData && packData.length > 0 ? packData.map(pack => {
                        return (
                            <Grid item xs={12/8}>
                                <Paper sx={{ height: '100%', position: 'relative', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                                    <Stack direction='column'>
                                        <Box sx={{ p: 0.5, pb: 0, position: 'relative' }}>
                                            <Typography variant='subtitles1' sx={{ float: 'left' }}>{pack.name} ({pack.played.length}/{pack.total})</Typography>
                                            <Typography variant='subtitles1' sx={{ float: 'right' }}>{Math.round(pack.played.length / pack.total * 100)}%</Typography>
                                        </Box>
                                        <Box sx={{ width: '100%', position: 'relative', top: '1px' }}>
                                            <LinearProgress sx={{ height: '6px' }} variant='determinate' value={pack.played.length / pack.total * 100} />
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>
                        )
                    }) : <></>
                }
            </Grid> */}
        </>
    );
}

export default SectionPacks;