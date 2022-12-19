import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Paper, Stack, Tab } from "@mui/material";
import { useState } from "react";
import SectionCards from "./SectionCards";
import SectionGrades from "./SectionGrades";
import SectionGraphs from "./SectionGraphs";

function UserDataContainer(props) {
    const [tab, setTab] = useState('0');

    const _IDs = {
        'profile': '0',
        'graphs': '1',
        'scores': '2'
    }

    return (
        <>
            <TabContext value={tab}>
                <Box component={Paper}>
                    <TabList onChange={(e, v) => setTab(v)} centered>
                        <Tab label='Profile' value={_IDs['profile']} />
                        <Tab label='Graphs' value={_IDs['graphs']} />
                        <Tab label='Scores' value={_IDs['scores']} />
                    </TabList>
                </Box>
                <TabPanel sx={{ p: 0 }} value={_IDs['profile']}>
                    <Stack direction='column' spacing={1}>
                        <SectionGrades user={props.user} />
                        <SectionCards user={props.user} />
                    </Stack>
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={_IDs['graphs']}>
                    <SectionGraphs dataset={props.user.data.monthly} />
                </TabPanel>
                <TabPanel sx={{ p: 0 }} value={_IDs['scores']}>

                </TabPanel>
            </TabContext>
        </>
    )
}

export default UserDataContainer;