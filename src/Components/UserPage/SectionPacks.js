import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { getBeatmapPackDetails, getBeatmapPacks, getBeatmaps } from "../../Helpers/Osu";
import { Accordion, Box, Button, ButtonGroup, Grid, LinearProgress, Modal, Paper, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import GlowBar from "../UI/GlowBar";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { is_numeric, lerpColor } from "../../Helpers/Misc";
import HtmlTooltip from "../UI/HtmlTooltip";
import PackCompletionModal from "../Modals/PackCompletionModal";

function SectionPacks(props) {
    const theme = useTheme();
    const [selectedPackType, setSelectedPackType] = useState(0);
    const [standardPacks, setStandardPacks] = useState([]);
    const [otherPacks, setOtherPacks] = useState([]);
    const [packData, setPackData] = useState([]);
    const [selectedPack, setSelectedPack] = useState(null);
    const [selectedPackData, setSelectedPackData] = useState(null);
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

            setPackData(_packData);
        })();
    }, []);

    useEffect(()=>{
        (async () => {
            if (!selectedPack) return;
            setSelectedPackData(null);
            packInfoModalElement.current.setOpen(true);

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
                scores: scores
            }

            setSelectedPackData(_selectedPackData);
        })()
    }, [selectedPack]);

    return (
        <>
            <PackCompletionModal data={selectedPackData} ref={packInfoModalElement} />
            <Grid sx={{ p: 2 }}>
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
                                            let themeColor = theme.typography.title.color;
                                            let color = lerpColor('#3c3c3c', themeColor, progressPercentage / 100);
                                            return (
                                                <Tooltip title={
                                                    <React.Fragment>
                                                        <Typography variant='body1'>{pack.pack_id} {pack.name ? `(${pack.name})` : ''}</Typography>
                                                        <Typography variant='body2'>Completion: {progressPercentage}%</Typography>
                                                        <Typography variant='body2'>{pack.played} / {pack.total}</Typography>
                                                    </React.Fragment>
                                                } placement='top' disableInteractive={true}>
                                                    <Box 
                                                        onClick={() => setSelectedPack(pack)}
                                                        sx={{
                                                        borderRadius: '3px',
                                                        height: '12px',
                                                        position: 'relative',
                                                        width: '12px',
                                                        backgroundColor: `${color}`,
                                                        boxShadow: `0px 0px 5px 5px ${themeColor}${pack.played === pack.total ? 'ff' : '00'}`,
                                                        margin: '2px',
                                                        '&:hover': {
                                                            cursor: 'pointer',
                                                            opacity: 0.5
                                                        }
                                                    }}>

                                                    </Box>
                                                </Tooltip>
                                            )
                                        }) : <></>
                                    }
                                </Paper>
                            </>
                        )
                    })
                }
            </Grid>
        </>
    );
}

export default SectionPacks;