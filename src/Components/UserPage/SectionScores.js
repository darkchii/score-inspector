import { useState } from 'react';
import { useCallback } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, Modal, Pagination, Stack, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import ScoreModal from '../ScoreModal';
import ScoreRow from '../ScoreRow.js';
import { Grid } from 'react-virtualized';
import ScoreFilter from '../ScoreFilter.js';
import moment from 'moment';

const SCORES_PER_PAGE = 100;

function SectionScores(props) {
    const [, updateState] = useState();
    const [modalData, setModalData] = useState({ active: false });
    const [scores, setScores] = useState([]);
    const [filteredScores, setFilteredScores] = useState([]);
    const [page, setPage] = useState(1);
    const [scoreFilter, setScoreFilter] = useState({});
    const [scoreFilterModalOpen, setScoreFilterModalOpen] = useState(false);
    const [cachedFilterData, setCachedFilterData] = useState(null);

    const _setFilteredScores = useCallback((scores) => {
        setFilteredScores(scores);
        setPage(1);
    }, []);

    useEffect(() => {
        //sort by score (test, ascending)
        props.user.scores.sort((a, b) => {
            let a_pp = a.pp > 0 ? a.pp : a.estimated_pp;
            let b_pp = b.pp > 0 ? b.pp : b.estimated_pp;
            return b_pp - a_pp;
        });
        setScores(props.user.scores);
        _setFilteredScores(props.user.scores);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilter = (filter) => {
        if (filter !== null) {
            const full_scores = props.user.scores;
            var scores = [];

            //approved status
            scores = full_scores.filter(score => {
                return filter.approved.includes(score.beatmap.approved);
            });

            //mods
            scores = scores.filter(score => {
                if (filter.modsUsage === 'any') {
                    if (score.enabled_mods === 0 && filter.enabledNomod) {
                        return true;
                    }
                    return (filter.enabledMods & score.enabled_mods) !== 0;
                }
                return filter.enabledMods === score.enabled_mods;
            });

            //grades
            scores = scores.filter(score => {
                return filter.enabledGrades.includes(score.rank);
            });

            if (filter.minScore !== null && filter.minScore !== '' && filter.minScore >= 0) { scores = scores.filter(score => score.score >= filter.minScore); }
            if (filter.maxScore !== null && filter.maxScore !== '' && filter.maxScore >= 0) { scores = scores.filter(score => score.score <= filter.maxScore); }

            if (filter.minStars !== null && filter.minStars !== '' && filter.minStars >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.star_rating >= filter.minStars); }
            if (filter.maxStars !== null && filter.maxStars !== '' && filter.maxStars >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.star_rating <= filter.maxStars); }

            if (filter.minPP !== null && filter.minPP !== '' && filter.minPP >= 0) { scores = scores.filter(score => score.pp >= filter.minPP); }
            if (filter.maxPP !== null && filter.maxPP !== '' && filter.maxPP >= 0) { scores = scores.filter(score => score.pp <= filter.maxPP); }

            if (filter.minAcc !== null && filter.minAcc !== '' && filter.minAcc >= 0) { scores = scores.filter(score => score.accuracy >= filter.minAcc); }
            if (filter.maxAcc !== null && filter.maxAcc !== '' && filter.maxAcc >= 0) { scores = scores.filter(score => score.accuracy <= filter.maxAcc); }

            if (filter.minCombo !== null && filter.minCombo !== '' && filter.minCombo >= 0) { scores = scores.filter(score => score.combo >= filter.minCombo); }
            if (filter.maxCombo !== null && filter.maxCombo !== '' && filter.maxCombo >= 0) { scores = scores.filter(score => score.combo <= filter.maxCombo); }

            if (filter.minAR !== null && filter.minAR !== '' && filter.minAR >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_ar >= filter.minAR); }
            if (filter.maxAR !== null && filter.maxAR !== '' && filter.maxAR >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_ar <= filter.maxAR); }

            if (filter.minOD !== null && filter.minOD !== '' && filter.minOD >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_od >= filter.minOD); }
            if (filter.maxOD !== null && filter.maxOD !== '' && filter.maxOD >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_od <= filter.maxOD); }

            if (filter.minCS !== null && filter.minCS !== '' && filter.minCS >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_cs >= filter.minCS); }
            if (filter.maxCS !== null && filter.maxCS !== '' && filter.maxCS >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_cs <= filter.maxCS); }

            if (filter.minHP !== null && filter.minHP !== '' && filter.minHP >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_hp >= filter.minHP); }
            if (filter.maxHP !== null && filter.maxHP !== '' && filter.maxHP >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.modded_hp <= filter.maxHP); }

            if (filter.minLength !== null && filter.minLength !== '' && filter.minLength >= 0) { scores = scores.filter(score => score.beatmap.modded_length >= filter.minLength); }
            if (filter.maxLength !== null && filter.maxLength !== '' && filter.maxLength >= 0) { scores = scores.filter(score => score.beatmap.modded_length <= filter.maxLength); }

            scores = scores.filter(score => {
                return moment(score.beatmap.approved_date).isBetween(filter.minApprovedDate, filter.maxApprovedDate, undefined, '[]');
            });

            scores = scores.filter(score => {
                return moment(score.date_played).isBetween(filter.minPlayedDate, filter.maxPlayedDate, undefined, '[]');
            });

            scores.sort(filter._sorter.sort);
            if (filter._sorter.reverse) {
                scores.reverse();
            }

            _setFilteredScores(scores);
            setCachedFilterData(filter);
        }
    }

    return (
        <Box sx={{
            mt: 2
        }}>
            {
                props.user.scores.length > 0 && scoreFilter ?
                    <>
                        <Box sx={{
                            display: 'flex',
                            //center vertically
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 2
                        }}>
                            <Button variant="contained" onClick={() => setScoreFilterModalOpen(true)}>Filter</Button>
                            {/* <TextField size='small' sx={{ width: '100%' }} variant="standard" value={`!getscores -loved true -u ${(props.user.osu.username.replace(/\s+/g, '+'))} ${cachedFilterData?.query ?? ''}`} inputProps={
                                { readOnly: true, }
                            } /> */}
                        </Box>

                        <Box sx={{ pb: 2, justifyContent: 'center', display: 'flex' }}>
                            <Pagination color="primary" boundaryCount={1} siblingCount={4} width='100%' page={page} onChange={(e, v) => setPage(v)} count={Math.ceil(filteredScores.length / SCORES_PER_PAGE)} />
                        </Box>

                        <Stack direction="column" justifyContent="center" alignItems="center" sx={{ mt: 2 }} spacing={0.5}>
                            {
                                filteredScores.slice((page - 1) * SCORES_PER_PAGE, (page) * SCORES_PER_PAGE).map((score, index) => {
                                    return (
                                        <ScoreRow data={{
                                            score: score,
                                        }} />
                                    )
                                })
                            }
                        </Stack>

                        <Box sx={{ pb: 2, justifyContent: 'center', display: 'flex' }}>
                            <Pagination color="primary" boundaryCount={1} siblingCount={4} width='100%' page={page} onChange={(e, v) => setPage(v)} count={Math.ceil(filteredScores.length / SCORES_PER_PAGE)} />
                        </Box>

                        <Dialog
                            open={scoreFilterModalOpen}
                            onClose={() => setScoreFilterModalOpen(false)}
                            maxWidth='lg'
                        >
                            <DialogTitle>Score Filter</DialogTitle>
                            <DialogContent>
                                <ScoreFilter filterData={cachedFilterData} onApply={handleFilter} />
                            </DialogContent>
                        </Dialog>
                    </> : <>
                        <Typography variant="h6" sx={{ textAlign: "center" }}>No scores found</Typography>
                    </>
            }
        </Box>
    );
}
export default SectionScores;