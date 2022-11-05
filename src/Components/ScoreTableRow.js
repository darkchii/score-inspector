import { Box, Card, Collapse, Grid, IconButton, LinearProgress, Tooltip, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { getGradeIcon, getModIcon } from "../Assets";
import { getModString, mods, mod_strings_long, toFixedNumber } from "../helper";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ScoreView from "./ScoreView";

function ScoreTableRow(props) {
    const [score, setScore] = React.useState(null);
    const [viewerOpen, setViewerOpen] = React.useState(false);

    useEffect(() => {
        setScore(props.data.score);
    }, [props.data]);

    const toggleViewer = () => {
        setViewerOpen(!viewerOpen);
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
                                    <Tooltip title={`${score.artist} - ${score.title} [${score.diffname}]`}>
                                        <Typography variant="subtitle1" sx={{ maxWidth: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                            {score.artist} - {score.title} [{score.diffname}]
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
                                    <Tooltip title={`Weight: ${(score.weight * 100).toFixed(0)}% ${toFixedNumber(score.pp * score.weight, 0).toLocaleString('en-US')}pp`}>
                                        <Typography variant="h5">{toFixedNumber(score.pp, 0).toLocaleString('en-US')}pp</Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={0.5} sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={toggleViewer} size="small">
                                        {viewerOpen ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Box>
                        <Grid>
                            {
                                viewerOpen ?
                                    <>
                                        <Collapse in={viewerOpen}>
                                            <ScoreView data={{
                                                score: score, style: {
                                                    bgcolor: 'background.paper',
                                                    width: '100%',
                                                    boxShadow: 24,
                                                    borderRadius: 0,
                                                }
                                            }} />
                                        </Collapse>
                                    </>
                                    : <></>
                            }
                        </Grid>
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