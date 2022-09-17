import { Card, CardContent, Typography, Grid, Button, Chip, Stack } from '@mui/material';
import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import TopplaysModal from '../../../Components/TopplaysModal';
import { getGrade, getPerformance } from '../../../osu';
import LaunchIcon from '@mui/icons-material/Launch';
import moment from 'moment';
import ScoreModal from '../../../Components/ScoreModal';
import VisibilityIcon from '@mui/icons-material/Visibility';

function GeneralHighestValueScoreCard(props) {
    const [modalData, setModalData] = React.useState({ active: false });

    return (
        <>
            <ScoreModal data={modalData} />
            <Card sx={{ backgroundPosition: 'center', backgroundSize: 'auto', backgroundImage: `url(https://assets.ppy.sh/beatmaps/${props.score.set_id}/covers/cover@2x.jpg)` }}>
                <CardContent sx={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <Stack spacing={1}>
                        <Typography variant='h5'>Top {props.valueTitle} play</Typography>
                        <Typography>{props.score.title} [{props.score.diffname}]</Typography>
                        <Typography variant='h3'>{props.valueLabel}</Typography>
                        <Typography>Played <Chip color="primary" label={moment(props.score.date_played).fromNow()} size="small"></Chip></Typography>
                        <Button startIcon={<VisibilityIcon />} onClick={()=>{setModalData({active: true, score: props.score})}} variant='contained'>View score</Button>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralHighestValueScoreCard;