/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { getBeatmapPackDetails, getBeatmapPacks, getBeatmaps } from "../../Helpers/Osu";
import { Box, Grid2, Paper, Tooltip, Typography, useTheme } from "@mui/material";
import { is_numeric, lerpColor } from "../../Helpers/Misc";
import PackCompletionModal from "../Modals/PackCompletionModal";
import Loader from "../UI/Loader";

function SectionPacks(props) {
    const theme = useTheme();
    const [packData, setPackData] = useState([]);
    const [selectedPack, setSelectedPack] = useState(null);
    const [selectedPackData, setSelectedPackData] = useState(null);
    const [themeColor] = useState(theme.typography.title.color);
    const packInfoModalElement = useRef(null);

    useEffect(() => {
        (async () => {
            let packs = await getBeatmapPacks();
            let packDetails = await getBeatmapPackDetails();
            let _standardPacks = [];
            let _otherPacks = [];
            for (let i = 0; i < packs.length; i++) {
                let details = packDetails.find(pack => pack.tag === packs[i].pack_id);
                let obj = {
                    pack_id: packs[i].pack_id,
                    name: details?.name,
                    total: packs[i].count,
                    played: 0
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
                if (score.beatmap && score.beatmap.packs) {
                    let packs = score.beatmap.packs?.map(pack => pack.pack_id) ?? [];
                    packs.forEach(pack => {
                        _standardPacks.forEach(_pack => {
                            if (_pack.pack_id === pack) {
                                _pack.played++;
                            }
                        });
                        _otherPacks.forEach(_pack => {
                            if (_pack.pack_id === pack) {
                                _pack.played++;
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
                });
            });

            setPackData(_packData);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (!selectedPack) return;
            setSelectedPackData(null);

            const beatmaps = (await getBeatmaps({
                include_loved: true,
                pack: selectedPack.pack_id
            }))?.data;

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
            }

            if(selectedPack){
                setSelectedPackData(_selectedPackData);
            }
        })()
    }, [selectedPack]);

    const openPackInfo = (pack) => {
        setSelectedPackData(null);
        packInfoModalElement.current.setOpen(true);
        setSelectedPack(pack);
    }

    return (
        <>
            <PackCompletionModal data={selectedPackData} ref={packInfoModalElement} />
            <Grid2 sx={{ p: 2 }}>
                {
                    packData.map((packType, index) => {
                        return (
                            <>
                                <Typography variant='h6'>{packType.name}</Typography>
                                <Paper sx={{
                                    display: 'inline-flex',
                                    flexWrap: 'wrap',
                                    p: 2
                                }}>
                                    {
                                        packType.packs && packType.packs.length > 0 ? packType.packs.map(pack => {
                                            let progressPercentage = Math.round(pack.played / pack.total * 100);
                                            return (
                                                <Tooltip title={
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
                                                            backgroundColor: `${pack.color}`,
                                                            margin: '2px',
                                                            '&:hover': {
                                                                cursor: 'pointer',
                                                                opacity: 0.5
                                                            }
                                                        }}>

                                                    </Box>
                                                </Tooltip>
                                            )
                                        }) : <Loader />
                                    }
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