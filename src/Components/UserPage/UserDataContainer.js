import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Paper, Stack, Tab } from "@mui/material";
import { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import TodayIcon from '@mui/icons-material/Today';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import GradingIcon from '@mui/icons-material/Grading';
import ImageIcon from '@mui/icons-material/Image';
import SectionCards from "./SectionCards";
import SectionGrades from "./SectionGrades";
import SectionGraphs from "./SectionGraphs";
import SectionScores from "./SectionScores";
import SectionDaily from "./SectionDaily";
import SectionComments from "./SectionComments";
import styled from "@emotion/styled";
import SectionCompletion from "./SectionCompletion";
import SectionCompactCard from "./SectionCompactCard";

const StyledTab = styled(Tab)({
    minHeight: 'auto',
    padding: 10,
});

function UserDataContainer(props) {
    const [tab, setTab] = useState('0');

    const _IDs = {
        'profile': '0',
        'daily': '1',
        'graphs': '2',
        'scores': '3',
        'completion': '4',
        'comments': '5',
        'card': '6'
    }

    return (
        <>
            <TabContext value={tab}>
                <Box component={Paper}>
                    <TabList onChange={(e, v) => setTab(v)} centered>
                        <StyledTab icon={<PersonIcon />} iconPosition='start' label='Profile' value={_IDs['profile']} />
                        <StyledTab icon={<TodayIcon />} iconPosition='start' label='Daily' value={_IDs['daily']} />
                        <StyledTab icon={<AutoGraphIcon />} iconPosition='start' label='Graphs' value={_IDs['graphs']} />
                        <StyledTab icon={<FormatListBulletedIcon />} iconPosition='start' label='Scores' value={_IDs['scores']} />
                        <StyledTab icon={<GradingIcon />} iconPosition='start' label='Completion' value={_IDs['completion']} />
                        <StyledTab icon={<InsertCommentIcon />} iconPosition='start' label='Comments' value={_IDs['comments']} />
                        <StyledTab icon={<ImageIcon />} iconPosition='start' label='Card' value={_IDs['card']} />
                    </TabList>
                </Box>
                <TabPanel sx={{ p: 0 }} value={_IDs['profile']}>
                    <Stack direction='column' spacing={0.5}>
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
                <TabPanel sx={{ p: 0 }} value={_IDs['comments']}>
                    <SectionComments user={props.user} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={_IDs['completion']}>
                    <SectionCompletion user={props.user} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={_IDs['card']}>
                    <SectionCompactCard user={props.user} />
                </TabPanel>
            </TabContext>
        </>
    )
}

export default UserDataContainer;