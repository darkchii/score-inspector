import { useEffect, useState } from "react";
import { GetRemoteRoles, GetRemoteUsersByRole, GetRoleIcon } from "../Helpers/Account";
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, CardHeader, Chip, Grid, Stack, Typography } from "@mui/material";
import PlayerCard from "../Components/PlayerCard";
import { useNavigate } from "react-router-dom/dist";
import { FilterScores, getFullUser } from "../Helpers/Osu";
import Loader from "../Components/UI/Loader";
import { Helmet } from "react-helmet";
import config from "../config.json";
import ScoreFilter from "../Components/ScoreFilter";
import moment from "moment";
import axios from "axios";
import { GetAPI } from "../Helpers/Misc";
import { AutoSizer, Column, Table as VTable } from 'react-virtualized';

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

            if (filter.enabledMods) { query.push(`mods=${filter.enabledMods.join(',')}`); }
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

            const url_query = query.join('&');
            console.log(url_query);
            try {
                const result = await axios.get(`${GetAPI()}scores/all?${url_query}&limit=100`);
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
                            <ScoreFilter filterData={cachedFilterData} onApply={handleFilter} noAttributes={true} />
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
                                            <Column label="User" dataKey="user.username" cellRenderer={({ rowData }) => rowData.user?.username ?? <span class="italic">{rowData.user_id}</span>} width={100} />
                                            <Column label="Map" dataKey="map.title" cellRenderer={({ rowData }) => <span>{rowData.beatmap.artist} - {rowData.beatmap.title} [{rowData.beatmap.diffname}]</span>} width={350} />
                                            <Column label="Score" dataKey="score" cellDataGetter={({ rowData }) => rowData.score} width={100} />
                                            <Column label="PP" dataKey="pp" cellDataGetter={({ rowData }) => rowData.pp} width={100} />
                                            <Column label="Grade" dataKey="grade" cellDataGetter={({ rowData }) => rowData.rank} width={100} />
                                            <Column label="Mods" dataKey="mods" cellDataGetter={({ rowData }) => rowData.enabled_mods} width={100} />
                                            <Column label="Combo" dataKey="combo" width={100} />
                                            <Column label="Accuracy" dataKey="accuracy" width={100} />
                                            <Column label="Date" dataKey="date_played" cellDataGetter={({ rowData }) => rowData.date_played} width={150} />
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