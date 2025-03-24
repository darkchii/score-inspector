/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { getBeatmapPackDetails, getBeatmapPacks, getBeatmaps } from "../../Helpers/Osu";
import { Box, Container, FormControlLabel, Grid2, Paper, Switch, Typography, useTheme } from "@mui/material";
import { formatNumber, is_numeric, lerpColor } from "../../Helpers/Misc";
import PackCompletionModal from "../Modals/PackCompletionModal";
import Loader from "../UI/Loader";
import CompletionModeNotice from "../UI/CompletionModeNotice";
import OsuTooltip from "../OsuTooltip";
import DoneIcon from '@mui/icons-material/Done';

function SectionPacks(props) {
    const theme = useTheme();
    const [packData, setPackData] = useState([]);
    const [selectedPack, setSelectedPack] = useState(null);
    const [selectedPackData, setSelectedPackData] = useState(null);
    const [themeColor] = useState(theme.typography.title.color);
    const packInfoModalElement = useRef(null);

    useEffect(() => {
        if (props.user.inspector_user.is_completion_mode) {
            return;
        }
        (async () => {
            let packs = getBeatmapPacks(props.user.beatmaps);
            let packDetails = await getBeatmapPackDetails();
            let _standardPacks = [];
            let _otherPacks = [];
            for (let i = 0; i < packs.length; i++) {
                let details = packDetails.find(pack => pack.tag === packs[i].pack_id);
                let obj = {
                    pack_id: packs[i].pack_id,
                    name: details?.name,
                    total: parseInt(packs[i].count),
                    played: 0,
                    full_combos: 0
                }
                
                //check if pack_id is a string
                if(typeof packs[i].pack_id !== 'string'){
                    continue;
                }

                if (packs[i].pack_id.charAt(0) === 'S' && is_numeric(packs[i].pack_id.charAt(1))) {
                    _standardPacks.push(obj);
                } else {
                    _otherPacks.push(obj);
                }
            }

            //remove all letters from pack id to sort by that
            _standardPacks.sort((a, b) => {
                let _a = a.pack_id.replace(/\D/g, '');
                let _b = b.pack_id.replace(/\D/g, '');
                return _a - _b;
            });

            _otherPacks.sort((a, b) => {
                let _a = a.pack_id.replace(/\D/g, '');
                let _b = b.pack_id.replace(/\D/g, '');
                return _a - _b;
            });

            props.user.scores?.forEach(score => {
                if (score.beatmap && props.user.beatmaps[score.beatmap.beatmap_id]) {
                    // let packs = score.beatmap.packs?.map(pack => pack.pack_id) ?? [];
                    let packs = props.user.beatmaps[score.beatmap.beatmap_id].packs?.map(pack => pack.pack_id) ?? [];
                    packs.forEach(pack => {
                        _standardPacks.forEach(_pack => {
                            if (_pack.pack_id === pack) {
                                _pack.played++;
                                if (score.is_fc) {
                                    _pack.full_combos++;
                                }
                            }
                        });
                        _otherPacks.forEach(_pack => {
                            if (_pack.pack_id === pack) {
                                _pack.played++;
                                if (score.is_fc) {
                                    _pack.full_combos++;
                                }
                            }
                        });
                    })
                }
            });

            let _packData = [{
                name: 'Standard Packs',
                packs: _standardPacks
            }, {
                name: 'Other Packs',
                packs: _otherPacks
            }];

            //add color to each pack
            _packData.forEach(packType => {
                packType.packs.forEach(pack => {
                    let progressPercentage = Math.round(pack.played / pack.total * 100);
                    pack.color = lerpColor('#3c3c3c', themeColor, progressPercentage / 100);
                    pack.completed = progressPercentage === 100;
                    pack.completed_full_combo = pack.full_combos === pack.total;
                });

                //cache numbers
                packType.played = packType.packs.filter(pack => pack.played > 0).length;
                packType.completed = packType.packs.filter(pack => pack.completed).length;
                packType.completed_full_combo = packType.packs.filter(pack => pack.completed_full_combo).length;

                packType.played_percentage = Math.round(packType.played / packType.packs.length * 100);
                packType.completed_percentage = Math.round(packType.completed / packType.packs.length * 100);
                packType.completed_full_combo_percentage = Math.round(packType.completed_full_combo / packType.packs.length * 100);
            });

            setPackData(_packData);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (!selectedPack) return;
            setSelectedPackData(null);

            // const beatmaps = (await getBeatmaps({
            //     include_loved: true,
            //     pack: selectedPack.pack_id
            // }))?.data;
            const beatmaps = Object.values(props.user.beatmaps)?.filter(beatmap => {
                if (beatmap.packs) {
                    let packs = beatmap.packs?.map(pack => pack.pack_id) ?? [];
                    return packs.includes(selectedPack.pack_id);
                }
                return false;
            });

            //get scores with this pack id
            const scores = props.user.scores?.filter(score => {
                if (score.beatmap && score.beatmap.packs) {
                    let packs = score.beatmap.packs?.map(pack => pack.pack_id) ?? [];
                    return packs.includes(selectedPack.pack_id);
                }
                return false;
            });

            let _selectedPackData = {
                pack_id: selectedPack.pack_id,
                name: selectedPack.name,
                total: beatmaps?.length,
                played: scores.length,
                beatmaps: beatmaps,
                scores: scores,
                //sum of beatmap[x].length
                played_length: scores.reduce((acc, score) => {
                    return acc + score.beatmap.length;
                }, 0),
                total_length: beatmaps.reduce((acc, beatmap) => {
                    return acc + beatmap.length;
                }, 0)
            }

            if (selectedPack) {
                setSelectedPackData(_selectedPackData);
            }
        })()
    }, [selectedPack]);

    const openPackInfo = (pack) => {
        setSelectedPackData(null);
        packInfoModalElement.current.setOpen(true);
        setSelectedPack(pack);
    }

    if (props.user.inspector_user.is_completion_mode) {
        return (
            <Container>
                <CompletionModeNotice />
            </Container>
        )
    }

    return (
        <>
            <PackCompletionModal data={selectedPackData} ref={packInfoModalElement} />
            <Grid2 sx={{ p: 2 }}>
                {
                    packData.map((packType, index) => {
                        return (
                            <>
                                <Paper key={`packType_${index}`} sx={{
                                    p: 2
                                }}>
                                    <Typography variant='h6'>{packType.name}</Typography>
                                    <Typography variant='body2'>Total: {formatNumber(packType.packs.length)}</Typography>
                                    <Typography variant="body2">Played: {formatNumber(packType.played)} ({formatNumber(packType.played_percentage, 2)}%)</Typography>
                                    <Typography variant="body2">Completed: {formatNumber(packType.completed)} ({formatNumber(packType.completed_percentage, 2)}%)</Typography>
                                    <Typography variant="body2">Completed (Full FC): {formatNumber(packType.completed_full_combo)} ({formatNumber(packType.completed_full_combo_percentage, 2)}%)</Typography>
                                    <Box sx={{
                                        display: 'inline-flex',
                                        flexWrap: 'wrap',
                                    }}>
                                        {
                                            packType.packs && packType.packs.length > 0 ? packType.packs.map((pack, pack_index) => {
                                                let progressPercentage = Math.round(pack.played / pack.total * 100);
                                                return (
                                                    <OsuTooltip key={`pack_${pack_index}`} title={
                                                        <React.Fragment>
                                                            <Typography variant='body1'>{pack.pack_id} {pack.name ? `(${pack.name})` : ''}</Typography>
                                                            <Typography variant='body2'>Completion: {progressPercentage}%</Typography>
                                                            <Typography variant='body2'>{pack.played} / {pack.total}</Typography>
                                                        </React.Fragment>
                                                    } placement='top' disableInteractive={true}>
                                                        <Box
                                                            onClick={() => openPackInfo(pack)}
                                                            sx={{
                                                                borderRadius: '3px',
                                                                height: '12px',
                                                                position: 'relative',
                                                                width: '12px',
                                                                backgroundColor: `${pack.completed ? 'gold' : pack.color}`,
                                                                margin: '2px',
                                                                '&:hover': {
                                                                    cursor: 'pointer',
                                                                    opacity: 0.5
                                                                },
                                                            }}>
                                                            {
                                                                pack.completed_full_combo && <Box sx={{
                                                                    position: 'absolute',
                                                                    top: '50%',
                                                                    left: '50%',
                                                                    transform: 'translate(-50%, -50%)',
                                                                }}>
                                                                    <DoneIcon
                                                                        sx={{
                                                                            color: 'black',
                                                                            fontSize: 12,
                                                                            fontWeight: 'bold'
                                                                        }}
                                                                    />
                                                                </Box>
                                                            }
                                                        </Box>
                                                    </OsuTooltip>
                                                )
                                            }) : <Loader />
                                        }
                                    </Box>
                                </Paper>
                            </>
                        )
                    })
                }
            </Grid2>
        </>
    );
}

export default SectionPacks;