import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Card, Collapse, Grid, IconButton, LinearProgress, setRef, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { getGradeIcon, getModIcon } from '../Helpers/Assets';
import { toFixedNumber } from '../Helpers/Misc';
import { getModString, mods, mod_strings_long } from '../Helpers/Osu';
import VisibilityIcon from '@mui/icons-material/Visibility';

function ScoreTableRow(props) {
    const [score, setScore] = useState(null);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [height, setHeight] = useState(0);
    const [allowScoreViewer, setAllowScoreViewer] = useState(true);

    const openScoreView = (index) => {
        props?.openScoreView(index);
    }

    useEffect(() => {
        setScore(props.data.score);
    }, [props.data]);

    useEffect(() => {
        setAllowScoreViewer(props.allowScoreViewer!==undefined ? props.allowScoreViewer : true);
    }, [props.allowScoreViewer])

    const toggleViewer = () => {
        //setViewerOpen(!viewerOpen);
        openScoreView(props.index);
    };

    return (
        <>
            {
                score !== null ?
                    <>
                        <Box component={Card} display="flex" sx={{ margin: 0, width: '100%', height: '2.5rem', bgcolor: 'background.default', borderBottomLeftRadius: viewerOpen ? 0 : null, borderBottomRightRadius: viewerOpen ? 0 : null }} >
                            <Grid container sx={{ margin: 1 }}>
                                <Grid item xs={0.5} sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                    {/* {getGradeIcon(score.rank)} */}
                                    <img src={getGradeIcon(score.rank)} alt={score.rank} />
                                </Grid>
                                <Grid item xs={7.5} sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Tooltip title={`${score.beatmap.artist} - ${score.beatmap.title} [${score.beatmap.diffname}]`}>
                                        <Typography variant="subtitle1" sx={{ maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                            {score.beatmap.artist} - {score.beatmap.title} [{score.beatmap.diffname}]
                                        </Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={1.5} sx={{ height: '100%', alignContent: 'right', display: 'flex', alignItems: 'center' }}>
                                    {
                                        getModString(score.enabled_mods).map(mod => (
                                            <Tooltip title={mod_strings_long[mods[mod]]}>
                                                <img height="20px" src={getModIcon(mod)} alt={mod} />
                                            </Tooltip>
                                        ))
                                    }
                                </Grid>
                                <Grid item xs={1} sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="subtitle1">{score.accuracy.toFixed(2)}%</Typography>
                                </Grid>
                                <Grid item xs={1} sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Tooltip title={`Weight: ${(score.displayed_pp.weight * 100).toFixed(0)}% ${toFixedNumber(score.displayed_pp.total * score.displayed_pp.weight, 0).toLocaleString('en-US')}pp`}>
                                        <Typography variant="h5">{toFixedNumber(score.displayed_pp.total, 0).toLocaleString('en-US')}pp</Typography>
                                    </Tooltip>
                                </Grid>
                                {
                                    allowScoreViewer ?
                                        <Grid item xs={0.5} sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                            <IconButton onClick={toggleViewer} size="small">
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Grid> : null
                                }
                            </Grid>
                        </Box>
                    </>
                    : <>
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    </>
            }
        </>
    );
}
export default ScoreTableRow;