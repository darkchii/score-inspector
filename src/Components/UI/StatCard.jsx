import { Box, Grid2, Paper, Skeleton, Typography, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import OsuTooltip from "../OsuTooltip";

function StatCard(props) {
    const theme = useTheme();
    const [opacity, setOpacity] = useState('ff');

    useEffect(() => {
        if (props?.opacity) {
            //convert 0-1 to hex
            const hex = Math.round(255 * props.opacity).toString(16);
            setOpacity(hex);
        }
    }, [props]);

    return <>
        <OsuTooltip title={props.tooltip ?? ''}>
            <Paper sx={{
                backgroundColor: `${props.color[props.brightness ?? 600]}${opacity}`,
                overflow: 'hidden',
                position: 'relative',
                height: props.height ?? undefined,
            }}>
                {
                    props?.stats === null || props?.stats === undefined ?
                        <Skeleton
                            variant="rectangular"
                            animation="wave"
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                zIndex: 300,
                                backgroundColor: grey[800],
                                opacity: 0.5
                            }} /> : <></>
                }
                <Box sx={{ p: 1, zIndex: 300 }}>
                    <Box sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        zIndex: 200,
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: 0,
                            height: 0,
                            borderLeft: '100px solid transparent',
                            borderRight: '100px solid transparent',
                            borderBottom: '173.2px solid white', // You can adjust the color and size here
                            top: -85,
                            right: -95,
                            opacity: 0.1 * (props?.opacity ?? 1),
                        },
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: 0,
                            height: 0,
                            borderLeft: '100px solid transparent',
                            borderRight: '100px solid transparent',
                            borderBottom: '173.2px solid white', // You can adjust the color and size here
                            top: -125,
                            right: -15,
                            opacity: 0.1 * (props?.opacity ?? 1),
                        }
                    }} />
                    <Grid2 container direction="column" sx={{ position: 'relative', zIndex: 500 }}>
                        <Grid2>
                            <Typography
                                sx={{
                                    fontSize: props.titleSize ?? '1rem',
                                    fontWeight: 500,
                                    color: theme.palette.secondary[200]
                                }}
                            >
                                {props.title}
                            </Typography>
                        </Grid2>
                        <Grid2>
                            <Typography sx={{ fontSize: props.statSize ?? '2.3rem', fontWeight: 500, mt: 0.5 }}>
                                {props?.stats ?? '-'}
                            </Typography>
                        </Grid2>
                    </Grid2>
                </Box>
            </Paper>
        </OsuTooltip>
    </>
}

export default StatCard;