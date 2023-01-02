import { Button, ButtonGroup, Grid } from "@mui/material";
import { useState } from "react";
import ToolCommandHelper from "../Components/Tools/ToolCommandHelper";
import ToolMissingBeatmaps from "../Components/Tools/ToolMissingBeatmaps";

const NAV_WIDTH = 3;
const TOOL_OBJECTS = [
    {
        name: 'Command Helper',
        component: <ToolCommandHelper />
    },
    {
        name: 'Missing Beatmaps',
        component: <ToolMissingBeatmaps /> 
    }
]
function Tools() {
    const [currentTool, setTool] = useState(0);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={NAV_WIDTH}>
                    <ButtonGroup orientation="vertical" fullWidth>
                        {
                            TOOL_OBJECTS.map((tool, index) => {
                                return (
                                    <Button onClick={() => setTool(index)} variant={index === currentTool ? 'contained' : 'outlined'}>{tool.name}</Button>
                                )
                            })
                        }
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12 - NAV_WIDTH}>
                    {TOOL_OBJECTS[currentTool].component}
                </Grid>
            </Grid>
        </>
    );
}

export default Tools;