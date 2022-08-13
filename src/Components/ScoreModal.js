import { Box, Card, CardContent, CardMedia, Chip, Modal, Typography, Grid, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, tableCellClasses } from "@mui/material";
import React, { useEffect } from "react";
import NumberFormat from "react-number-format";
import TimeGraph from "./TimeGraph";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getGradeIcon, getModIcon } from "../Assets";
import { getModString, mods, mod_strings_long } from "../helper";
import { getPerformance } from "../osu";
ChartJS.register(ArcElement, Tooltip, Legend);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    minWidth: 800,
    boxShadow: 24,
    borderRadius: 3,
};

function ScoreModal(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [performance, setPerformance] = React.useState(null);

    useEffect(() => {
        if (props.data !== undefined && props.data.score !== undefined) {
            setPerformance(null);
            setOpen(props.data.active);

            const pp = [];
            pp["100%"] = getPerformance({ accuracy: 1, score: props.data.score, combo: props.data.maxcombo, count300: props.data.score.count300 + props.data.score.count100 + props.data.score.count50 + props.data.score.countmiss, count100: 0, count50: 0, countmiss: 0 });
            pp["99%"] = getPerformance({ accuracy: 0.99, score: props.data.score, combo: props.data.score.maxcombo, count300: props.data.score.count300 + props.data.score.count100 + props.data.score.count50 + props.data.score.countmiss, count100: 0, count50: 0, countmiss: 0 });
            pp["98%"] = getPerformance({ accuracy: 0.98, score: props.data.score, combo: props.data.score.maxcombo, count300: props.data.score.count300 + props.data.score.count100 + props.data.score.count50 + props.data.score.countmiss, count100: 0, count50: 0, countmiss: 0 });
            pp["95%"] = getPerformance({ accuracy: 0.95, score: props.data.score, combo: props.data.score.maxcombo, count300: props.data.score.count300 + props.data.score.count100 + props.data.score.count50 + props.data.score.countmiss, count100: 0, count50: 0, countmiss: 0 });
            pp["90%"] = getPerformance({ accuracy: 0.90, score: props.data.score, combo: props.data.score.maxcombo, count300: props.data.score.count300 + props.data.score.count100 + props.data.score.count50 + props.data.score.countmiss, count100: 0, count50: 0, countmiss: 0 });
            pp["80%"] = getPerformance({ accuracy: 0.80, score: props.data.score, combo: props.data.score.maxcombo, count300: props.data.score.count300 + props.data.score.count100 + props.data.score.count50 + props.data.score.countmiss, count100: 0, count50: 0, countmiss: 0 });

            console.log(pp);
            setPerformance(pp);
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
                    <Card sx={style}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={`https://assets.ppy.sh/beatmaps/${props.data.score.set_id}/covers/cover.jpg`}
                        />
                        <CardContent>
                            <Typography id="modal-modal-title" variant="h6" component="h2"><Chip sx={{ mr: 1 }} size='small' label={`${props.data.score.star_rating.toFixed(2)}★`} variant="outlined" /> {props.data.score.artist} - {props.data.score.title} [{props.data.score.diffname}] {`${props.data.score.enabled_mods > 0 ? '+' : ''}${getModString(props.data.score.enabled_mods)}`}</Typography>
                            <Grid container spacing={3} sx={{ justifyContent: 'left', my: 1 }}>
                                <Grid item sx={{ width: '30%' }}>
                                    <Doughnut data={{
                                        labels: ["300", "100", "50", "Miss"],
                                        datasets: [
                                            {
                                                data: [props.data.score.count300, props.data.score.count100, props.data.score.count100, props.data.score.countmiss],
                                                backgroundColor: [
                                                    '#8BC34A',
                                                    '#FDD835',
                                                    '#FB8C00',
                                                    '#D32F2F',
                                                ],
                                                borderWidth: 5,
                                                borderColor: '#ffffff00',
                                                hoverOffset: 5
                                            }
                                        ]
                                    }}
                                        options={{
                                            plugins: {
                                                legend: {
                                                    display: false
                                                },
                                                datalabels: {
                                                    display: 'auto',
                                                    color: 'white',
                                                    font: {
                                                        family: "Roboto",
                                                        weight: 700
                                                    },
                                                    backgroundColor: '#000000aa',
                                                    borderRadius: 4
                                                }
                                            }
                                        }}
                                    ></Doughnut>
                                </Grid>
                                <Grid item sx={{ width: '70%', minHeight: '100%' }}>
                                    <Box height="100%" direction="column" display="flex" alignItems="center">
                                        <Grid>
                                            <Typography variant="h3" id="modal-modal-description" sx={{ mt: 0 }}><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.score.score} /></Typography>
                                            <Typography variant="subtitle1" display="flex" alignItems="center" id="modal-modal-description" sx={{ mt: 0 }} spacing="5">{getGradeIcon(props.data.score.rank)}&nbsp;{props.data.score.accuracy.toFixed(2)}%&nbsp;
                                                ★ {props.data.score.pp.toFixed(2)}pp
                                                ★ {props.data.score.combo}x/{props.data.score.maxcombo}x
                                            </Typography>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                            {
                                performance !== null ?
                                    <Card variant="outlined" sx={{ my: 5 }}>
                                        <TableContainer>
                                            <Table size="small" sx={{
                                                [`& .${tableCellClasses.root}`]: {
                                                    borderBottom: "none"
                                                }
                                            }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>80% FC</TableCell>
                                                        <TableCell>90% FC</TableCell>
                                                        <TableCell>95% FC</TableCell>
                                                        <TableCell>98% FC</TableCell>
                                                        <TableCell>99% FC</TableCell>
                                                        <TableCell>100% FC</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>{performance["80%"].total.toFixed(0)}pp</TableCell>
                                                        <TableCell>{performance["90%"].total.toFixed(0)}pp</TableCell>
                                                        <TableCell>{performance["95%"].total.toFixed(0)}pp</TableCell>
                                                        <TableCell>{performance["98%"].total.toFixed(0)}pp</TableCell>
                                                        <TableCell>{performance["99%"].total.toFixed(0)}pp</TableCell>
                                                        <TableCell>{performance["100%"].total.toFixed(0)}pp</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Card>
                                    : <></>
                            }
                            <Typography id="modal-modal-description" sx={{ mt: 0 }}>
                                Mapped by <a href={`https://osu.ppy.sh/users/${props.data.score.creator_id}`} target='_blank' rel='noreferrer'>{props.data.score.creator}</a>
                            </Typography>
                        </CardContent>
                    </Card>
                </Modal>
                : <></>
            }
        </>
    );
}
export default ScoreModal;