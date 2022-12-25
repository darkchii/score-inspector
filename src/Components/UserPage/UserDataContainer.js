import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Paper, Stack, Tab } from "@mui/material";
import { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import TodayIcon from '@mui/icons-material/Today';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SectionCards from "./SectionCards";
import SectionGrades from "./SectionGrades";
import SectionGraphs from "./SectionGraphs";
import SectionScores from "./SectionScores";
import SectionDaily from "./SectionDaily";

function UserDataContainer(props) {
    const [tab, setTab] = useState('0');

    const _IDs = {
        'profile': '0',
        'daily': '1',
        'graphs': '2',
        'scores': '3'
    }

    return (
        <>
            <TabContext value={tab}>
                <Box component={Paper}>
                    <TabList onChange={(e, v) => setTab(v)} centered>
                        <Tab icon={<PersonIcon />} iconPosition='start' label='Profile' value={_IDs['profile']} />
                        <Tab icon={<TodayIcon />} iconPosition='start' label='Daily' value={_IDs['daily']} />
                        <Tab icon={<AutoGraphIcon />} iconPosition='start' label='Graphs' value={_IDs['graphs']} />
                        <Tab icon={<FormatListBulletedIcon />} iconPosition='start' label='Scores' value={_IDs['scores']} />
                    </TabList>
                </Box>
                <TabPanel sx={{ p: 0 }} value={_IDs['profile']}>
                    <Stack direction='column' spacing={1}>
                        <SectionGrades user={props.user} />
                        <SectionCards user={props.user} />
                    </Stack>
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={_IDs['daily']}>
                    <SectionDaily user={props.user} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={_IDs['graphs']}>
                    <SectionGraphs user={props.user} dataset={props.user.data.monthly} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={_IDs['scores']}>
                    <SectionScores user={props.user} />
                </TabPanel>
            </TabContext>
        </>
    )
}

export default UserDataContainer;