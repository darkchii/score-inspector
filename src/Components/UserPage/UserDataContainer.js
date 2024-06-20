/* eslint-disable react-hooks/exhaustive-deps */
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Paper, Stack, Tab } from "@mui/material";
import { useEffect, useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import TodayIcon from '@mui/icons-material/Today';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GradingIcon from '@mui/icons-material/Grading';
import LayersIcon from '@mui/icons-material/Layers';
import SectionCards from "./SectionCards";
import SectionGrades from "./SectionGrades";
import SectionGraphs from "./SectionGraphs";
import SectionScores from "./SectionScores";
import SectionDaily from "./SectionDaily";
import styled from "@emotion/styled";
import SectionCompletion from "./SectionCompletion";
import SectionPacks from "./SectionPacks";
import { useParams } from "react-router-dom";
import _ from "lodash";

const StyledTab = styled(Tab)({
    minHeight: 'auto',
    padding: 10,
});

function UserDataContainer(props) {
    const [tab, setTab] = useState(null);
    const params = useParams();

    const _IDs = {
        'profile': '0',
        'daily': '1',
        'graphs': '2',
        'scores': '3',
        'completion': '4',
        'packs': '5',
    }

    useEffect(()=>{
        if (params.page) {
            setTab(_IDs[params.page]);
        }else{
            setTab(_IDs['profile']);
        }
    }, [params.page]);

    if(!tab) return null;

    return (
        <>
            <TabContext value={tab}>
                <Box component={Paper}>
                    <TabList onChange={(e, v) => {
                        setTab(v);
                        //set the :page parameter in the URL
                        //props.history.push(`/user/${props.user.osu.id}/${_.invert(_IDs)[v]}`);
                        window.history.pushState({}, '', `/user/${props.user.osu.id}/${_.invert(_IDs)[v]}`);
                    }} centered>
                        <StyledTab icon={<PersonIcon />} iconPosition='start' label='Profile' value={_IDs['profile']} />
                        <StyledTab icon={<TodayIcon />} iconPosition='start' label='Daily' value={_IDs['daily']} />
                        <StyledTab icon={<AutoGraphIcon />} iconPosition='start' label='Graphs' value={_IDs['graphs']} />
                        <StyledTab icon={<FormatListBulletedIcon />} iconPosition='start' label='Scores' value={_IDs['scores']} />
                        <StyledTab icon={<GradingIcon />} iconPosition='start' label='Completion' value={_IDs['completion']} />
                        <StyledTab icon={<LayersIcon />} iconPosition='start' label='Packs' value={_IDs['packs']} />
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
                    <SectionGraphs user={props.user} dataset={props.user.data.periodic} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={_IDs['scores']}>
                    <SectionScores user={props.user} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={_IDs['completion']}>
                    <SectionCompletion user={props.user} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={_IDs['packs']}>
                    <SectionPacks user={props.user} />
                </TabPanel>
            </TabContext>
        </>
    )
}

export default UserDataContainer;