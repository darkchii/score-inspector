/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, AlertTitle, Box, Grid, Paper, Tooltip, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { getMedals } from "../../Helpers/Osu";
import { makeStyles } from "@mui/styles";
import { Masonry } from "@mui/lab";

const useStyles = makeStyles({
    tooltip: {
        background: 'transparent',
    },
});

function SectionMedals(props) {
    const classes = useStyles();
    const [medals, setMedals] = useState([]);

    useEffect(() => {
        (async () => {
            let _medals = await getMedals();

            // order by .ordering
            _medals.sort((a, b) => a.ordering - b.ordering);

            let grouped_medals = {};
            _medals.forEach(medal => {
                if (grouped_medals[medal.category] === undefined) {
                    grouped_medals[medal.category] = [];
                }
                medal.achieved = props.user.osu.user_achievements.some(achievement => achievement.achievement_id === medal.medal_id);
                grouped_medals[medal.category].push(medal);
            });

            setMedals(grouped_medals);
        })();
    }, []);

    return (
        <>
            <Alert severity="info">Use osekai.net for more in-depth information on medals and how to clear them.</Alert>
            <Paper elevation={3} sx={{ pt: 2, pl: 1 }}>
                <Masonry columns={3} spacing={2}>
                    {Object.keys(medals).map(category => {
                        return (
                            <Alert icon={false} severity='info'>
                                <AlertTitle>{category}</AlertTitle>
                                <Grid container spacing={0.5}>
                                    {
                                        medals[category].map(medal => {
                                            return (
                                                <Grid item xs={12 / 8}>
                                                    <Tooltip
                                                        title={
                                                            <React.Fragment>
                                                                <Alert severity={medal.achieved ? 'success' : 'error'}>
                                                                    <Typography variant='body1'>{medal.name}</Typography>
                                                                    <Typography variant='body2'>{medal.description}</Typography>
                                                                </Alert>
                                                            </React.Fragment>
                                                        }
                                                        placement="top"
                                                        disableInteractive={true}
                                                        classes={classes}
                                                    >
                                                        <Box sx={{
                                                            filter: medal.achieved ? 'none' : 'grayscale(100%)',
                                                            opacity: medal.achieved ? '1' : '0.5',
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                filter: medal.achieved ? 'none' : 'grayscale(0%)',
                                                                opacity: medal.achieved ? '1' : '0.75',
                                                                cursor: 'pointer'
                                                            }
                                                        }}>
                                                            <img
                                                                style={{
                                                                    width: '100%',
                                                                    height: 'auto',
                                                                }}
                                                                src={medal.icon_url}
                                                                alt={medal.name}
                                                                title={medal.name} />
                                                        </Box>
                                                    </Tooltip>
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                            </Alert>
                        )
                    })}
                </Masonry>
            </Paper>
        </>
    );
}

export default SectionMedals;