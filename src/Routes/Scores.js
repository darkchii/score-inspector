import { useEffect, useState } from "react";
import { GetFormattedName, GetRemoteRoles, GetRemoteUsersByRole, GetRoleIcon } from "../Helpers/Account";
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, CardHeader, Chip, Grid, Stack, Tooltip, Typography } from "@mui/material";
import PlayerCard from "../Components/PlayerCard";
import { useNavigate } from "react-router-dom/dist";
import { FilterScores, getFullUser, getModString, mod_strings_long, mods } from "../Helpers/Osu";
import Loader from "../Components/UI/Loader";
import { Helmet } from "react-helmet";
import config from "../config.json";
import ScoreFilter from "../Components/ScoreFilter";
import moment from "moment";
import axios from "axios";
import { GetAPI } from "../Helpers/Misc";
import { AutoSizer, Column, Table as VTable } from 'react-virtualized';
import { getGradeIcon, getModIcon } from "../Helpers/Assets";

function Scores(props) {
    const navigate = useNavigate();
    const [cachedFilterData, setCachedFilterData] = useState(null);
    const [scores, setScores] = useState([]);
    const [isWorking, setIsWorking] = useState(false);

    const handleFilter = async (filter) => {
        if (filter !== null) {
            setIsWorking(true);
            console.log(filter);
            //build url query
            let query = [];
            query.push(`approved=${filter.approved.join(',')}`);
            query.push(`grades=${filter.enabledGrades.join(',')}`);
            query.push(`order=${filter.order}`);
            query.push(`order_dir=${filter._sorter.reverse ? 'asc' : 'desc'}`);
            query.push(`mods_usage=${filter.modsUsage}`);
            query.push(`country=${filter.country.join(',')}`);
            if(filter.enabledMods || filter.enabledNomod) {
                let _mods = [];
                if(filter.enabledNomod) _mods.push('NM');
                if(filter.enabledMods) _mods = _mods.concat(getModString(filter.enabledMods));
                query.push(`mods=${_mods.join(',')}`);
            }
            if (filter.minScore) { query.push(`min_score=${filter.minScore}`); }
            if (filter.maxScore) { query.push(`max_score=${filter.maxScore}`); }
            if (filter.minPP) { query.push(`min_pp=${filter.minPP}`); }
            if (filter.maxPP) { query.push(`max_pp=${filter.maxPP}`); }
            if (filter.minStars) { query.push(`min_stars=${filter.minStars}`); }
            if (filter.maxStars) { query.push(`max_stars=${filter.maxStars}`); }
            if (filter.minCombo) { query.push(`min_combo=${filter.minCombo}`); }
            if (filter.maxCombo) { query.push(`max_combo=${filter.maxCombo}`); }
            if (filter.minAcc) { query.push(`min_acc=${filter.minAcc}`); }
            if (filter.maxAcc) { query.push(`max_acc=${filter.maxAcc}`); }
            if (filter.minLength) { query.push(`min_length=${filter.minLength}`); }
            if (filter.maxLength) { query.push(`max_length=${filter.maxLength}`); }
            if (filter.minAR) { query.push(`min_ar=${filter.minAR}`); }
            if (filter.maxAR) { query.push(`max_ar=${filter.maxAR}`); }
            if (filter.minCS) { query.push(`min_cs=${filter.minCS}`); }
            if (filter.maxCS) { query.push(`max_cs=${filter.maxCS}`); }
            if (filter.minOD) { query.push(`min_od=${filter.minOD}`); }
            if (filter.maxOD) { query.push(`max_od=${filter.maxOD}`); }
            if (filter.minHP) { query.push(`min_hp=${filter.minHP}`); }
            if (filter.maxHP) { query.push(`max_hp=${filter.maxHP}`); }
            if (filter.minPlayedDate) { query.push(`min_played_date=${moment(filter.minPlayedDate).format('YYYY-MM-DD')}`); }
            if (filter.maxPlayedDate) { query.push(`max_played_date=${moment(filter.maxPlayedDate).format('YYYY-MM-DD')}`); }
            if (filter.minApprovedDate) { query.push(`min_approved_date=${moment(filter.minApprovedDate).format('YYYY-MM-DD')}`); }
            if (filter.maxApprovedDate) { query.push(`max_approved_date=${moment(filter.maxApprovedDate).format('YYYY-MM-DD')}`); }

            if(filter.minRank) { query.push(`min_rank=${filter.minRank}`); }
            if(filter.maxRank) { query.push(`max_rank=${filter.maxRank}`); }

            const url_query = query.join('&');
            console.log(url_query);
            try {
                const result = await axios.get(`${GetAPI()}scores/all?${url_query}&limit=1000`);
                setScores(result.data);
            } catch (e) {
                console.error(e);
            }
            setIsWorking(false);
            setCachedFilterData(filter);
        }
    }

    return (
        <>
            <Helmet>
                <title>Scores - {config.APP_NAME}</title>
            </Helmet>
            <Box>
                <Box sx={{
                    //just make it invisible if working, otherwise ScoreFilter loses its state
                    visibility: isWorking ? 'hidden' : 'visible',
                    transition: 'visibility 0s linear 0.5s',
                }}>
                    <Accordion>
                        <AccordionSummary>
                            <Typography>Filter scores</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ScoreFilter extended={true} filterData={cachedFilterData} onApply={handleFilter} noAttributes={true} />
                        </AccordionDetails>
                    </Accordion>
                </Box>
                {
                    isWorking ? <Loader /> : (
                        <>
                            <Box sx={{ pb: 2, display: 'flex', height: 600 }}>
                                <AutoSizer>
                                    {({ height, width }) => (
                                        <VTable
                                            width={width}
                                            height={height}
                                            headerHeight={30}
                                            rowHeight={30}
                                            rowCount={scores.length}
                                            rowGetter={({ index }) => scores[index]}
                                        >
                                            <Column label="User" dataKey="user.username" cellRenderer={({ rowData }) => GetFormattedName(rowData.inspector_user)} width={150} />
                                            <Column label="Map" dataKey="map.title" cellRenderer={({ rowData }) => <span>{rowData.beatmap.artist} - {rowData.beatmap.title}</span>} width={450} />
                                            <Column dataKey="map.diffname" cellRenderer={({ rowData }) => <span>{rowData.beatmap.diffname}</span>} width={150} />
                                            <Column label="Stars" dataKey="stars" cellRenderer={({ rowData }) => 
                                                `${Math.round(rowData.beatmap.modded_sr.star_rating*100)/100}*`
                                                } width={100} />
                                            <Column label="Score" dataKey="score" cellDataGetter={({ rowData }) => rowData.score.toLocaleString('en-US')} width={100} />
                                            <Column label="PP" dataKey="pp" cellDataGetter={({ rowData }) => `${Math.round(rowData.pp ?? 0).toLocaleString('en-US')}pp`} width={100} />
                                            <Column label="" dataKey="grade" cellRenderer={({ rowData }) => <img src={getGradeIcon(rowData.rank)} alt={rowData.rank} />} width={60} />
                                            <Column label="Mods" dataKey="mods" cellRenderer={({ rowData }) =>
                                                getModString(rowData.enabled_mods).map(mod => (
                                                    <Tooltip title={mod_strings_long[mods[mod]]}>
                                                        <img height="20px" src={getModIcon(mod)} alt={mod} />
                                                    </Tooltip>
                                                ))
                                            } width={150} />
                                            <Column label="Combo" dataKey="combo" cellRenderer={({rowData}) => `${rowData.combo}/${rowData.beatmap.maxcombo}x`} width={100} />
                                            <Column label="Acc" dataKey="accuracy" cellRenderer={({rowData}) => `${rowData.accuracy}%`} width={100} />
                                            <Column label="Date" dataKey="date_played" cellRenderer={({rowData}) => `${rowData.date_played}`} width={150} />
                                        </VTable>
                                    )}
                                </AutoSizer>
                            </Box>
                        </>
                    )
                }
            </Box>
        </>
    );
}

export default Scores;