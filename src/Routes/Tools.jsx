import { Button, ButtonGroup, Grid2 } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import ToolCommandHelper from "../Components/Tools/ToolCommandHelper";
import ToolLevelCalculator from "../Components/Tools/ToolLevelCalculator";
import ToolMissingBeatmaps from "../Components/Tools/ToolMissingBeatmaps";
import ToolScoreRank from "../Components/Tools/ToolScoreRank";
import { Helmet } from "react-helmet";
import config from "../config.json";

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.tool]);

    return (
        <>
            <Helmet>
                <title>{TOOL_OBJECTS[currentTool]?.name || 'Tools'} - {config.APP_NAME}</title>
            </Helmet>
            <Grid2 container spacing={2}>
                <Grid2 size={NAV_WIDTH}>
                    <ButtonGroup orientation="vertical" fullWidth>
                        {
                            TOOL_OBJECTS.map((tool, index) => {
                                return (
                                    <Button key={index} component={Link} to={`/tools/${tool.url}`} variant={index === currentTool ? 'contained' : 'outlined'}>{tool.name}</Button>
                                )
                            })
                        }
                    </ButtonGroup>
                </Grid2>
                <Grid2 size={12 - NAV_WIDTH}>
                    {TOOL_OBJECTS[currentTool].component}
                </Grid2>
            </Grid2>
        </>
    );
}

export default Tools;