import { Tooltip, Box, Card, CardContent, CardMedia, Chip, Modal, Typography, Grid, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, tableCellClasses, CardHeader } from "@mui/material";
import React, { useEffect } from "react";
import TimeGraph from "./TimeGraph";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { getGradeIcon, getModIcon } from "../Assets";
import { getModString, mods, mod_strings_long } from "../helper";
import { getPerformance } from "../osu";
import moment from "moment";
import ScoreView from "./ScoreView";
ChartJS.register(ArcElement, ChartTooltip, Legend);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    minWidth: 800,
    boxShadow: 24,
    borderRadius: 3
};

function ScoreModal(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (props.data !== undefined && props.data.score !== undefined) {
            setOpen(props.data.active);
        }
    }, [props.data]);

    return (
        <>
            {props.data !== undefined && props.data.score !== undefined ?
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <ScoreView data={{
                        score: props.data.score, style: {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            minWidth: 800,
                            boxShadow: 24,
                            borderRadius: 3
                        }
                    }} />
                </Modal>
                : <></>
            }
        </>
    );
}
export default ScoreModal;