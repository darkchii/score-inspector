import { Card, CardContent, Modal, Typography, Grid, List, ListItem } from "@mui/material";
import React, { useEffect } from "react";
import ScoreTableRow from "../ScoreTableRow";

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

    useEffect(() => {
        setOpen(props.data.active);

        setScores(props.data.scores);
    }, [props.data]);

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
                            <List dense>
                                {
                                    scores.map((score, index) => (
                                        <>
                                            <ListItem>
                                                <Grid container>
                                                    <Grid item xs={0.6} sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', }}>
                                                        <Typography variant="subtitle1">{index + 1}</Typography>
                                                    </Grid>
                                                    <Grid item xs={11.4}>
                                                        <ScoreTableRow data={{ score: score }} />
                                                    </Grid>
                                                </Grid>
                                                {/* <Typography>Test</Typography> */}
                                            </ListItem>
                                        </>
                                    ))
                                }
                            </List>
                        </CardContent>
                    </Card>
                </Modal>
                : <></>
            }
        </>
    );
}
export default TopplaysModal;