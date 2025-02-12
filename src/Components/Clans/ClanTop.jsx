import { Box, Card, CardContent, CardMedia, Container, Divider, Grid2, Stack, styled, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { formatNumber, showNotification } from "../../Helpers/Misc";
import Mods from "../../Helpers/Mods";
import { GetFormattedName } from "../../Helpers/Account";
import { GetTopClans } from "../../Helpers/Clan";
import moment from "moment";
import Loader from "../UI/Loader";
import OsuTabs from "../OsuTabs";
import ClanLeaderboardItem from "../Leaderboards/ClanLeaderboardItem";
import { grey } from "@mui/material/colors";
import { LEADERBOARD_ITEM_HEIGHT } from "../Leaderboards/LeaderboardItem";

const ClanPlayTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
    background-color: transparent;
    max-width: none;
`);

function ClanPlayTooltipContent({ clan, type }) {
    return (
        <Card>
            <CardMedia
                component="img"
                height="140"
                image={`https://assets.ppy.sh/beatmaps/${clan.ranking_prepared?.top_play?.beatmap?.set_id}/covers/cover.jpg`}
            />
            <CardContent>
                {
                    clan.ranking_prepared?.[type] ?
                        <>
                            <Typography variant='body1'>{clan.ranking_prepared?.[type]?.beatmap?.artist} - {clan.ranking_prepared?.[type]?.beatmap?.title} [{clan.ranking_prepared?.[type]?.beatmap?.diffname}]</Typography>
                            <Typography variant='body2'>{clan.ranking_prepared?.[type]?.beatmap?.version}</Typography>
                            <Typography variant='body2'>{formatNumber(clan.ranking_prepared?.[type]?.pp, 1)}pp</Typography>
                            <Typography variant='body2'>{formatNumber(clan.ranking_prepared?.[type]?.score, 0)} score</Typography>
                            <Typography variant='body2'>{formatNumber(clan.ranking_prepared?.[type]?.accuracy, 2)}%</Typography>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'start',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                            }}>
                                {Mods.valueOf(clan.ranking_prepared?.[type]?.mods).map(mod => Mods.getModElement(mod, 20))}
                            </Box>
                            <Divider sx={{ mt: 1, mb: 1 }} />
                            <Typography variant='body1'>{GetFormattedName(clan.ranking_prepared?.[type]?.user)}</Typography>
                        </>
                        : <Typography variant='body1'>Score data unavailable somehow</Typography>
                }
            </CardContent>
        </Card>
    )
}

const CLAN_RANKING_STATS = {
    'weighted_pp': {
        name: 'Weighted PP',
        formatter: (clan) => `${(Math.round(clan.ranking_prepared.weighted_pp * 100) / 100).toLocaleString('en-US')}pp`,
    },
    'total_pp': {
        name: 'Total PP',
        formatter: (clan) => `${(Math.round(clan.ranking_prepared.total_pp * 100) / 100).toLocaleString('en-US')}pp`,
    },
    'total_scores': {
        name: 'Clears',
        formatter: (clan) => `${clan.ranking_prepared.total_scores.toLocaleString('en-US')}`,
    },
    'total_score': {
        name: 'Score',
        formatter: (clan) => `${clan.ranking_prepared.total_score.toLocaleString('en-US')}`,
    },
    'total_ss_score': {
        name: 'SS Score',
        formatter: (clan) => `${clan.ranking_prepared.total_ss_score.toLocaleString('en-US')}`,
    },
    'top_play': {
        name: 'Top PP play',
        formatter: (clan) => `${(Math.round((clan.ranking_prepared?.top_play?.pp ?? 0) * 100) / 100).toLocaleString('en-US')}pp`,
        tooltip: (clan) => (
            <ClanPlayTooltipContent clan={clan} type='top_play' />
        )
    },
    'top_score': {
        name: 'Top Score play',
        formatter: (clan) => `${(clan.ranking_prepared?.top_score?.score ?? 0).toLocaleString('en-US')}`,
        tooltip: (clan) => (
            <ClanPlayTooltipContent clan={clan} type='top_score' />
        )
    }
}

function ClanTop() {
    //todo; special leaderboards (monthly top scores etc)
    //these are seperate from regular all-time leaderboards
    //this is meant for short time competition
    const [data, setData] = useState(null);
    const [activeStatIndex, setActiveStatIndex] = useState(0);
    const [activeStat, setActiveStat] = useState(Object.keys(CLAN_RANKING_STATS)[activeStatIndex]);

    useEffect(() => {
        setActiveStat(Object.keys(CLAN_RANKING_STATS)[activeStatIndex]);
    }, [activeStatIndex]);

    useEffect(() => {
        (async () => {
            try {
                const response = await GetTopClans();

                if (response) {
                    //convert response.date (YYYY-MM) to a more readable format (August 2024)
                    const date = moment(response.date, 'YYYY-MM').format('MMMM YYYY');
                    setData({
                        date: date,
                        data: response.data,
                    });
                } else {
                    setData(null);
                    showNotification('Error', 'An error occurred while fetching the top clans.', 'error');
                }
            } catch (err) {
                console.error(err);
                showNotification('Error', 'An error occurred while fetching the top clans.', 'error');
            }
        })()
    }, []);

    if (!data) return <Loader />

    return <Box>
        <Container maxWidth='lg'>
            <Box sx={{
                zIndex: 2
            }}>
                <Typography variant='h3' sx={{
                    fontWeight: 100,
                }}>{data.date}</Typography>
                <Typography variant='body1'>Best clans</Typography>
            </Box>
            <Box sx={{
                //center horizontally
                justifyContent: 'center',
                display: 'flex',
            }}>
                <OsuTabs value={activeStatIndex} onChange={(e, value) => setActiveStatIndex(value)}>
                    {
                        Object.keys(CLAN_RANKING_STATS).map((stat, i) => {
                            return (
                                <Tab key={i} label={CLAN_RANKING_STATS[stat].name} />
                            )
                        })
                    }
                </OsuTabs>
            </Box>
            <Box>
                <Stack spacing={1} sx={{
                    mt: 2
                }}>
                    {
                        data.data[activeStat].map((clan, index) => {
                            return (
                                <ClanPlayTooltip key={index} title={CLAN_RANKING_STATS[activeStat].tooltip ? CLAN_RANKING_STATS[activeStat].tooltip(clan) : ''}>
                                    <Grid2>
                                        <ClanLeaderboardItem
                                            // height={
                                            //     LEADERBOARD_ITEM_HEIGHT * (index === 0 ? 2 : 1)
                                            // }
                                            index={index + 1}
                                            clan={clan}
                                            values={[
                                                {
                                                    value: '', alignment: 'left', variant: 'body2'
                                                },
                                                {
                                                    value: CLAN_RANKING_STATS[activeStat].name,
                                                    alignment: 'right',
                                                    variant: 'body2',
                                                    color: grey[500]
                                                },
                                                {
                                                    value: CLAN_RANKING_STATS[activeStat].formatter(clan), alignment: 'left', variant: 'body2'
                                                },
                                                {
                                                    value: '', alignment: 'right', variant: 'body2'
                                                }
                                            ]}
                                        />
                                    </Grid2>
                                </ClanPlayTooltip>
                            )
                        })
                    }
                </Stack>
                <Box>
                    <Typography variant='body2' sx={{
                        fontStyle: 'italic',
                        color: grey[500],
                        mt: 1
                    }}>Last updated: {moment(data.data.update_date).fromNow()}</Typography>
                </Box>
                <Box sx={{
                    mt: 1,
                }}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant='h6'>Overall statistics</Typography>
                            <TableContainer>
                                <Table size='small'>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><Typography sx={{ fontSize: '0.7rem', }}>Weighted PP</Typography></TableCell>
                                            <TableCell><Typography sx={{ fontSize: '0.7rem', }}>Total PP</Typography></TableCell>
                                            <TableCell><Typography sx={{ fontSize: '0.7rem', }}>Clears</Typography></TableCell>
                                            <TableCell><Typography sx={{ fontSize: '0.7rem', }}>Total Score</Typography></TableCell>
                                            <TableCell><Typography sx={{ fontSize: '0.7rem', }}>Total SS Score</Typography></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>{(Math.round(data.data.global_stats.weighted_pp * 100) / 100).toLocaleString('en-US')}pp</TableCell>
                                            <TableCell>{(Math.round(data.data.global_stats.total_pp * 100) / 100).toLocaleString('en-US')}pp</TableCell>
                                            <TableCell>{data.data.global_stats.total_scores.toLocaleString('en-US')}</TableCell>
                                            <TableCell>{data.data.global_stats.total_score.toLocaleString('en-US')}</TableCell>
                                            <TableCell>{data.data.global_stats.total_ss_score.toLocaleString('en-US')}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Container>
    </Box>
}

export default ClanTop;