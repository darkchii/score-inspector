import { Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import moment from "moment";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from "react";
import ScoreModal from "../ScoreModal";

function BestScoreCard(props) {
    const [modalData, setModalData] = useState({ active: false });

    return (
        <>
            <ScoreModal data={modalData} />
            <Card sx={{ height: '100%', borderRadius: '11px', backgroundPosition: 'center', backgroundSize: 'auto', backgroundImage: `url(https://assets.ppy.sh/beatmaps/${props.score.set_id}/covers/cover@2x.jpg)` }}>
                <CardContent sx={{ height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '10px' }}>
                    <Stack spacing={1}>
                        <Typography variant='h6' sx={{ fontSize: '0.9em' }}>Top {props.valueTitle} play</Typography>
                        <Typography variant='title' sx={{ fontSize: '1em' }}>{props.score.title} [{props.score.diffname}]</Typography>
                        <Typography variant='h5' sx={{ fontSize: '1.1em' }}>{props.valueLabel}</Typography>
                        <Typography sx={{ fontSize: '1em' }}>Played <Chip color="primary" label={moment(props.score.date_played).fromNow()} size="small"></Chip></Typography>
                        <Button startIcon={<VisibilityIcon />} onClick={()=>{setModalData({active: true, score: props.score})}} variant='contained'>View score</Button>
                    </Stack>
                </CardContent>
            </Card>
        </>
    )
}

export default BestScoreCard;