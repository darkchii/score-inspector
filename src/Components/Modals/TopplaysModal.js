import { Card, CardContent, Modal, Typography, Grid, ListItem, Box, FormGroup, FormControlLabel, Switch } from "@mui/material";
import React, { useEffect } from "react";
import { List } from "react-virtualized";
import ScoreTableRow from "../ScoreTableRow";
import ScoreView from "../ScoreView";
import { MODAL_STYLE } from "../../Helpers/Misc";
import { PP_SYSTEM_NAMES } from "../../Helpers/Osu.js";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper2',
    width: 1200,
    boxShadow: 24,
    borderRadius: 3,
    maxHeight: '90%',
    overflowY: 'auto',
    overflowX: 'hidden'
};

function TopplaysModal(props) {
    const [open, setOpen] = React.useState(false);
    const [scores, setScores] = React.useState(null);
    const [sortedScores, setSortedScores] = React.useState(null);
    const handleClose = () => setOpen(false);
    const [viewingScore, setViewingScore] = React.useState(null);
    const [allowScoreViewer, setAllowScoreViewer] = React.useState(true);
    const [showLovedScores, setShowLovedScores] = React.useState(false);

    const openScoreView = (index) => {
        setViewingScore(scores[index]);
    }

    const updateFilteredScores = (_scores) => {
        if (_scores) {
            setSortedScores(_scores.filter((score) => {
                if (showLovedScores) {
                    return true;
                }
                return score.beatmap.approved !== 4;
            }).sort((a, b) => {
                if (a.recalc[props.data.pp_version].total > b.recalc[props.data.pp_version].total) { return -1; }
                if (a.recalc[props.data.pp_version].total < b.recalc[props.data.pp_version].total) { return 1; }
                return 0;
            }));
        }
    }

    useEffect(() => {
        setOpen(props.data.active);
        setScores(props.data.scores);
        updateFilteredScores(props.data.scores);
    }, [props.data]);

    useEffect(() => {
        if (scores) {
            updateFilteredScores(scores);
        }
    }, [showLovedScores])

    useEffect(() => {
        setAllowScoreViewer(props.allowScoreViewer !== undefined ? props.allowScoreViewer : true);
    }, [props.allowScoreViewer])

    const rowHeight = ({ index }) => {
        // const score = scores[index];
        return 40 + 5;
    };

    const rowRenderer = ({ index, key, style }) => {
        const score = sortedScores[index];
        return (
            <ListItem key={key} style={style}>
                <Grid container>
                    <Grid item xs={0.6} sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', }}>
                        <Typography variant="subtitle1">{index + 1}</Typography>
                    </Grid>
                    <Grid item xs={11.4}>
                        <ScoreTableRow allowScoreViewer={allowScoreViewer} openScoreView={openScoreView} index={index} data={{ score: score, pp_version: props.data.pp_version }} />
                    </Grid>
                </Grid>
            </ListItem>
        )
    };

    return (
        <>
            {open && scores !== null && sortedScores !== null ?
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Card sx={style}>
                        <CardContent sx={{ px: 1, py: 1 }}>
                            <Box sx={{ m: 1 }}>
                                <Typography variant="h6" component="h2">
                                    Top plays ({PP_SYSTEM_NAMES[props.data.pp_version]?.title ?? props.data.pp_version})
                                </Typography>
                                {/* loved maps toggle */}
                                <FormGroup>
                                    <FormControlLabel control={<Switch checked={showLovedScores} onChange={(e) => setShowLovedScores(!showLovedScores)} />} label={'Loved maps'} />
                                </FormGroup>
                            </Box>
                            <List
                                width={1200}
                                height={700}
                                rowRenderer={rowRenderer}
                                // rowCount={scores.length}
                                rowCount={sortedScores.length}
                                rowHeight={rowHeight}
                            />
                            {
                                allowScoreViewer ?
                                    <Modal
                                        open={viewingScore !== null}
                                        onClose={() => setViewingScore(null)}
                                    >
                                        <ScoreView
                                            data={{
                                                score: viewingScore, style: MODAL_STYLE,
                                                pp_version: props.data.pp_version
                                            }}
                                        />
                                    </Modal> : <></>

                            }
                        </CardContent>
                    </Card>
                </Modal>
                : <></>
            }
        </>
    );
}
export default TopplaysModal;