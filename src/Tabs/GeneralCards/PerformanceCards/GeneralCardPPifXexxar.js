import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { useState } from 'react';
import NumberFormat from 'react-number-format';
import TopplaysModal from '../../../Components/TopplaysModal';
import { getGrade, getPerformance } from '../../../osu';
import LaunchIcon from '@mui/icons-material/Launch';

function GeneralCardPPifXexxar(props) {
    const [modalData, setModalData] = useState({ active: false });

    return (
        <>
            <TopplaysModal data={modalData} />
            <Card>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h4"><NumberFormat displayType={'text'} thousandSeparator={true} value={props.data.processed.weighted.xexxar.toFixed(0)} />pp</Typography>
                            <Typography color="textSecondary">with xexxar profile pp proposal</Typography>
                            <Button startIcon={<LaunchIcon />} href='https://github.com/ppy/osu/discussions/20210' target='_blank' variant='contained' sx={{mt:2}}>See proposal</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardPPifXexxar;