import { Button, ButtonGroup, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ToolCommandHelper from "../Components/Tools/ToolCommandHelper";
import ToolLevelCalculator from "../Components/Tools/ToolLevelCalculator";
import ToolMissingBeatmaps from "../Components/Tools/ToolMissingBeatmaps";
import ToolScoreRank from "../Components/Tools/ToolScoreRank";

const NAV_WIDTH = 3;
function Tools() {
    const params = useParams();
    const [currentTool, setTool] = useState(0);

    const TOOL_OBJECTS = [
        {
            name: 'Command Helper',
            component: <ToolCommandHelper />,
            url: 'command-helper'
        },
        {
            name: 'Missing Beatmaps',
            component: <ToolMissingBeatmaps />,
            url: 'missing-beatmaps'
        },
        {
            name: 'Level Calculator',
            component: <ToolLevelCalculator />,
            url: 'level-calculator'
        },
        {
            name: 'Score Rank Calculator',
            component: <ToolScoreRank />,
            url: 'score-calculator'
        }
    ]

    useEffect(() => {
        const index = TOOL_OBJECTS.findIndex((tool) => tool.url === params.tool);
        if (index !== -1) {
            setTool(index);
        }
    }, [params.tool]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={NAV_WIDTH}>
                    <ButtonGroup orientation="vertical" fullWidth>
                        {
                            TOOL_OBJECTS.map((tool, index) => {
                                return (
                                    <Button component={Link} to={`/tools/${tool.url}`} variant={index === currentTool ? 'contained' : 'outlined'}>{tool.name}</Button>
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