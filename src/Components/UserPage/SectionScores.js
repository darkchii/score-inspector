import { useState } from 'react';
import { useCallback } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, Pagination, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import ScoreRow from '../ScoreRow.js';
import ScoreFilter from '../ScoreFilter.js';
import moment from 'moment';
import { FilterScores } from '../../Helpers/Osu.js';

const SCORES_PER_PAGE = 100;

function SectionScores(props) {
    const [filteredScores, setFilteredScores] = useState([]);
    const [page, setPage] = useState(1);
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
        _setFilteredScores(props.user.scores);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilter = (filter) => {
        if (filter !== null) {
            let { scores, _filter} = FilterScores(props.user.scores, filter);

            _setFilteredScores(scores);
            setCachedFilterData(filter);
        }
    }

    return (
        <Box sx={{
            mt: 2
        }}>
            {
                props.user.scores.length > 0 ?
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