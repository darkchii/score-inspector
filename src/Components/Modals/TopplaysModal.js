import { Card, CardContent, Modal, Typography, Grid, ListItem, Box, LinearProgress } from "@mui/material";
import React, { useEffect } from "react";
import { List } from "react-virtualized";
import ScoreTableRow from "../ScoreTableRow";
import ScoreView from "../ScoreView";

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
    const handleClose = () => setOpen(false);
    const [viewingScore, setViewingScore] = React.useState(null);

    const openScoreView = (index) => {
        console.log('opening score view for index ' + index + '')
        setViewingScore(scores[index]);
    }

    useEffect(() => {
        setOpen(props.data.active);

        setScores(props.data.scores);
    }, [props.data]);

    const rowHeight = ({ index }) => {
        const score = scores[index];
        return 40;
    };

    const rowRenderer = ({ index, key, style }) => {
        const score = scores[index];
        return (
            <ListItem key={key} style={style}>
                <Grid container>
                    <Grid item xs={0.6} sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', }}>
                        <Typography variant="subtitle1">{index + 1}</Typography>
                    </Grid>
                    <Grid item xs={11.4}>
                        <ScoreTableRow openScoreView={openScoreView} index={index} data={{ score: score, pp_version: props.data.pp_version }} />
                    </Grid>
                </Grid>
            </ListItem>
        )
    };

    return (
        <>
            {open && scores !== null ?
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Card sx={style}>
                        <CardContent sx={{ px: 1, py: 1 }}>
                            <List

                                width={1200}
                                height={700}
                                rowRenderer={rowRenderer}
                                rowCount={scores.length}
                                rowHeight={rowHeight}
                            />
                            <Modal
                                open={viewingScore !== null}
                                onClose={() => setViewingScore(null)}
                            >
                                <Box sx={{ ...style, width: '1000px', p: 0 }}>
                                    <ScoreView
                                        data={{
                                            score: viewingScore, style: {
                                                bgcolor: 'background.paper',
                                                width: '100%',
                                                boxShadow: 24,
                                                borderRadius: 0,
                                            },
                                            pp_version: props.data.pp_version
                                        }}
                                    />
                                </Box>
                            </Modal>
                        </CardContent>
                    </Card>
                </Modal>
                : <></>
            }
        </>
    );
}
export default TopplaysModal;