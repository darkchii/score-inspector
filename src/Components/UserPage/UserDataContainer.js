import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Paper, Stack, Tab, Tooltip } from "@mui/material";
import { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import TodayIcon from '@mui/icons-material/Today';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import GradingIcon from '@mui/icons-material/Grading';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import LayersIcon from '@mui/icons-material/Layers';
import SectionCards from "./SectionCards";
import SectionGrades from "./SectionGrades";
import SectionGraphs from "./SectionGraphs";
import SectionScores from "./SectionScores";
import SectionDaily from "./SectionDaily";
import SectionComments from "./SectionComments";
import styled from "@emotion/styled";
import SectionCompletion from "./SectionCompletion";
import SectionPacks from "./SectionPacks";
import SectionMedals from "./SectionMedals";
import GroupIcon from '@mui/icons-material/Group';
import SectionFriends from "./SectionFriends";

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
        'medals': '6',
        'packs': '7',
        'friends': '8'
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
                        <StyledTab icon={<MilitaryTechIcon />} iconPosition='start' label='Medals' value={_IDs['medals']} />
                        <StyledTab icon={<LayersIcon />} iconPosition='start' label='Packs' value={_IDs['packs']} />
                        <StyledTab disabled={!props.user.inspector_user.is_friends_public} icon={<GroupIcon />} iconPosition='start' label='Friends' value={_IDs['friends']} />
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
                <TabPanel sx={{ p: 0 }} value={_IDs['medals']}>
                    <SectionMedals user={props.user} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={_IDs['packs']}>
                    <SectionPacks user={props.user} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={_IDs['friends']}>
                    <SectionFriends user={props.user} />
                </TabPanel>
            </TabContext>
        </>
    )
}

export default UserDataContainer;