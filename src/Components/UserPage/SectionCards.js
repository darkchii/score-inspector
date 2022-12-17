import { Avatar, Box, Button, Card, CardContent, Chip, Container, Grid, Input, Modal, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import ReactCountryFlag from "react-country-flag";
import { getGradeIcon, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../../Helpers/Assets";

function SectionCards(props) {
    if (props.user == null) return (<></>);

    const _cards = [
        {
            title: 'Clears',
            value: props.user.scores?.length.toLocaleString('en-US') ?? 0,
            size: 2
        },
        {
            title: 'Average PP',
            value: (Math.round((props.user.data?.average.pp ?? 0) * 100) / 100).toLocaleString('en-US'),
            size: 1.5
        },
        {
            title: 'Play Count',
            value: props.user.osu.statistics.play_count.toLocaleString('en-US'),
            size: 2
        },
        {
            title: 'Average Acc',
            value: (Math.round((props.user.data?.average.acc ?? 0) * 100) / 100).toLocaleString('en-US') + '%',
            size: 1.5
        },
        {
            title: '',
            value: '',
            size: 1.5
        },
        {
            title: 'Ranked Score',
            value: props.user.data.total.score.toLocaleString('en-US'),
            size: 2.5
        },
        {
            title: 'Total Score',
            value: props.user.osu.statistics.total_score?.toLocaleString('en-US') ?? 'N/A',
            size: 2.5
        },
        {
            title: 'Score per clear',
            value: Math.round(props.user.data?.average.score)?.toLocaleString('en-US') ?? 0,
            size: 2.5
        },
        {
            title: 'Score Length',
            value: Math.round(moment.duration(props.user.data.total.length, 'seconds').asHours()) + ' hours',
            size: 2
        }
    ];

    return (
        <>
            <Grid container>
                {
                    _cards.map((card) => {
                        return (
                            <Grid item xs={card.size} sx={{p:0.3}}>
                                <Card elevation={2}>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <Typography variant='title' sx={{ fontSize: '1em' }}>{card.title}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant='h5'>{card.value}</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </>
    )
}

export default SectionCards;