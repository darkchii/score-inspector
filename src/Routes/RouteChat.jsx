import { Helmet } from "react-helmet";
import config from "../config.json";
import { Alert, Box, Card, CardContent, Grid2, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatNumberAsSize, GetAPI } from "../Helpers/Misc";
import StatCard from "../Components/UI/StatCard";
import { green, grey, pink, red, yellow } from "@mui/material/colors";
import Loader from "../Components/UI/Loader";
import { GetFormattedName } from "../Helpers/Account";
import ChartWrapper from "../Helpers/ChartWrapper";
import WordCloud from "../Components/UI/WordCloud";
import { approval_state } from "../Helpers/Osu";
import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import OsuTooltip from "../Components/OsuTooltip";

function RouteChat() {
    const [isWorking, setIsWorking] = useState(false);
    const [chatStats, setChatStats] = useState(null);
    const [chatHistory, setChatHistory] = useState(null);
    const [activeUsers, setActiveUsers] = useState(null);
    const [popularWords, setPopularWords] = useState(null);
    const [popularMaps, setPopularMaps] = useState(null);
    const [popularHours, setPopularHours] = useState(null);
    const theme = useTheme();

    const getStats = async () => {
        const data = await axios.get(`${GetAPI()}chatlog/stats`);
        if (data?.data) {
            let _data = data.data;
            _data.event_types_chart_data = {
                series: _data.event_types.map((item) => item.count),
                labels: _data.event_types.map((item) => item.event_type)
            }
            setChatStats(_data);
        }
    }

    const getHistory = async () => {
        const data = await axios.get(`${GetAPI()}chatlog/daily_count`);
        if (data?.data) {
            const graph_data = data.data.map((item) => {
                return [new Date(item.day), item.message_count];
            });
            setChatHistory(graph_data);
        }
    }

    const getActiveUsers = async () => {
        const data = await axios.get(`${GetAPI()}chatlog/active_users`);
        if (data?.data) {
            setActiveUsers(data.data);
        }
    }

    const getPopularWords = async () => {
        const data = await axios.get(`${GetAPI()}chatlog/popular_words`);
        if (data?.data) {
            //remap
            const fix = data.data.map((item) => {
                return {
                    word: item[0],
                    frequency: item[1]
                }
            });
            setPopularWords(fix);
        }
    }

    const getPopularMaps = async () => {
        const data = await axios.get(`${GetAPI()}chatlog/popular_beatmaps`);
        if (data?.data) {
            setPopularMaps(data.data);
        }
    }

    const getPopularHours = async () => {
        const data = await axios.get(`${GetAPI()}chatlog/popular_hours`);
        if (data?.data) {
            const graph_data_global = data.data.global.map((item) => {
                return [item.hour, item.message_count];
            });
            const graph_data_today = data.data.today.map((item) => {
                return [item.hour, item.message_count];
            });
            setPopularHours({
                global: graph_data_global,
                today: graph_data_today
            });
        }
    }

    useEffect(() => {
        (async () => {
            if (isWorking) return;
            setIsWorking(true);
            await getStats();
            await getHistory();
            await getActiveUsers();
            await getPopularWords();
            await getPopularMaps();
            await getPopularHours();
            setIsWorking(false);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isWorking || !chatStats || !chatHistory || !activeUsers || !popularWords || !popularMaps || !popularHours) {
        return <Loader />;
    }

    return (
        <>
            <Helmet>
                <title>Chat - {config.APP_NAME}</title>
            </Helmet>
            <>
                <Alert severity="info">These are statistics of the public osu! bancho chats. Tracking all messages since September 8, 2024. Language chats are NOT tracked.</Alert>
                <Box sx={{ mt: 1 }}>
                    <Grid2 container spacing={1}>
                        <Grid2 size={8}>
                            <div>
                                <Grid2 container spacing={1}>
                                    <Grid2 size={12/5}>
                                        <StatCard tooltip={chatStats?.message_count.toLocaleString('en-US')} title="Total messages" stats={formatNumberAsSize(chatStats?.message_count)} color={pink} />
                                    </Grid2>
                                    <Grid2 size={12/5}>
                                        <StatCard tooltip={chatStats?.message_count_today.toLocaleString('en-US')} title="Messages today" stats={formatNumberAsSize(chatStats?.message_count_today)} color={pink} />
                                    </Grid2>
                                    <Grid2 size={12/5}>
                                        <StatCard tooltip={chatStats?.unique_users.toLocaleString('en-US')} title="Players" stats={formatNumberAsSize(chatStats?.unique_users)} color={pink} />
                                    </Grid2>
                                    <Grid2 size={12/5}>
                                        <StatCard tooltip={'Events are triggered by commands (/np, /me)'} title="Event messages" stats={formatNumberAsSize(chatStats?.event_count)} color={pink} />
                                    </Grid2>
                                    <Grid2 size={12/5}>
                                        <StatCard tooltip={chatStats?.banned_users.toLocaleString('en-US')} title="Banned users" stats={formatNumberAsSize(chatStats?.banned_users)} color={pink} />
                                    </Grid2>
                                </Grid2>
                                <Grid2 container spacing={1} sx={{ mt: 1 }}>
                                    <Grid2 size={4}>
                                        <Stack spacing={1}>
                                            <Card elevation={3}>
                                                <CardContent>
                                                    <Typography variant="h6">Most active users</Typography>
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableBody>
                                                                {
                                                                    activeUsers?.map((user, i) => {
                                                                        return (
                                                                            <TableRow key={i}>
                                                                                <TableCell>{user.user ? GetFormattedName(user.user.inspector_user) : user.id}</TableCell>
                                                                                <TableCell>{user.message_count}</TableCell>
                                                                            </TableRow>
                                                                        )
                                                                    })
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </CardContent>
                                            </Card>
                                        </Stack>
                                    </Grid2>
                                    <Grid2 size={8}>
                                        <Stack spacing={1}>
                                            <Card elevation={3}>
                                                <CardContent>
                                                    <Typography variant="h6">Messages per day</Typography>
                                                    <Box sx={{ width: '100%', height: '230px' }}>
                                                        <ChartWrapper
                                                            options={{
                                                                chart: {
                                                                    id: "messages-graph",
                                                                },
                                                                yaxis: {
                                                                    title: 'Messages',
                                                                    labels: {
                                                                        formatter: (value) => {
                                                                            return formatNumberAsSize(value);
                                                                        }
                                                                    }
                                                                },
                                                                xaxis: {
                                                                    type: 'datetime',
                                                                    labels: {
                                                                        datetimeUTC: false,
                                                                        format: 'MMM dd yyyy',
                                                                    },
                                                                },
                                                                tooltip: {
                                                                    x: {
                                                                        format: 'MMM dd yyyy',
                                                                    },
                                                                    y: {
                                                                        formatter: (value) => {
                                                                            return value.toLocaleString('en-US');
                                                                        }
                                                                    }
                                                                },
                                                                dataLabels: {
                                                                    enabled: false
                                                                },
                                                                markers: {
                                                                    size: 2
                                                                },
                                                            }}
                                                            series={[
                                                                {
                                                                    name: 'Messages',
                                                                    type: 'column',
                                                                    data: chatHistory,
                                                                    color: theme.palette.primary.main
                                                                },
                                                            ]}
                                                            style={{
                                                                margin: '-1rem'
                                                            }}
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                            <div>
                                                <Grid2 container spacing={1}>
                                                    <Grid2 size={9}>

                                                        <Card elevation={3} sx={{ height: '100%' }}>
                                                            <CardContent sx={{ height: '100%' }}>
                                                                <Typography variant="h6">Popular words</Typography>
                                                                <WordCloud data={popularWords} />
                                                            </CardContent>
                                                        </Card>
                                                    </Grid2>
                                                    <Grid2 size={3}>
                                                        <Card elevation={3} sx={{ height: '100%' }}>
                                                            <CardContent sx={{ height: '100%' }}>
                                                                <Typography variant="h6">Events</Typography>
                                                                {/* center horizontally and vertically */}
                                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                                    <ChartWrapper
                                                                        type="pie"
                                                                        options={{
                                                                            labels: chatStats.event_types_chart_data.labels,
                                                                            legend: { show: false },
                                                                        }}
                                                                        series={chatStats.event_types_chart_data.series}
                                                                        style={{
                                                                            margin: '-1rem'
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid2>
                                                </Grid2>
                                            </div>
                                            <Card elevation={3}>
                                                <CardContent>
                                                    <Typography variant="h6">Popular chatting hours</Typography>
                                                    <Box sx={{ width: '100%', height: '230px' }}>
                                                        <ChartWrapper
                                                            options={{
                                                                chart: {
                                                                    id: "messages-graph",
                                                                },
                                                                xaxis: {
                                                                    title: 'Hour',
                                                                    labels: {
                                                                        formatter: (value) => {
                                                                            //show as 00:00 - 01:00, 01:00 - 02:00, etc
                                                                            //value may need a prefix 0
                                                                            const hour = value.toString().padStart(2, '0');
                                                                            return `${hour}:00 - ${hour}:59`;
                                                                        }
                                                                    }
                                                                },
                                                                yaxis: [
                                                                    {
                                                                        title: 'Total messages',
                                                                        labels: {
                                                                            formatter: (value) => {
                                                                                return formatNumberAsSize(value);
                                                                            }
                                                                        }
                                                                    },
                                                                    {
                                                                        title: 'Messages today',
                                                                        opposite: true,
                                                                        labels: {
                                                                            formatter: (value) => {
                                                                                return formatNumberAsSize(value);
                                                                            }
                                                                        }
                                                                    }
                                                                ],
                                                                tooltip: {
                                                                    x: {
                                                                        formatter: (value) => {
                                                                            const hour = value.toString().padStart(2, '0');
                                                                            return `${hour}:00 - ${hour}:59 UTC`;
                                                                        }
                                                                    },
                                                                    y: {
                                                                        formatter: (value) => {
                                                                            return value?.toLocaleString('en-US');
                                                                        }
                                                                    },
                                                                    shared: true
                                                                },
                                                                dataLabels: {
                                                                    enabled: false
                                                                },
                                                            }}
                                                            series={[
                                                                {
                                                                    name: 'Total messages',
                                                                    type: 'line',
                                                                    data: popularHours.global,
                                                                    color: theme.palette.primary.main
                                                                },
                                                                {
                                                                    name: 'Messages today',
                                                                    type: 'line',
                                                                    data: popularHours.today,
                                                                    color: theme.palette.secondary.secondary
                                                                },
                                                            ]}
                                                            style={{
                                                                margin: '-1rem'
                                                            }}
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Stack>
                                    </Grid2>
                                </Grid2>
                            </div>
                        </Grid2>
                        <Grid2 size={4}>
                            <Stack spacing={1}>
                                <Card elevation={3}>
                                    <CardContent>
                                        <Typography variant="h6">Most mentioned beatmaps</Typography>
                                        <Typography variant="caption">(Maps that are linked when running /np in the chat)</Typography>
                                        <TableContainer>
                                            <Table size="small">
                                                <TableBody>
                                                    {
                                                        popularMaps?.map((map) => {
                                                            const background = `https://assets.ppy.sh/beatmaps/${map.beatmap.beatmapset_id}/covers/cover.jpg`;
                                                            const black_overlay = background ? '0.8' : '0';
                                                            return (
                                                                <TableRow component={Card} key={map.beatmap_id} sx={{
                                                                    "&:hover": {
                                                                        opacity: 0.5,
                                                                        cursor: 'pointer'
                                                                    },
                                                                    backgroundImage: `url(${background})`,
                                                                    backgroundSize: 'cover',
                                                                    backgroundPosition: 'center',
                                                                    backgroundRepeat: 'no-repeat'
                                                                }}
                                                                    onClick={() => {
                                                                        window.open(`https://osu.ppy.sh/beatmaps/${map.beatmap_id}`, "_blank");
                                                                    }}
                                                                >
                                                                    <TableCell width={'3%'} sx={{ backgroundColor: `rgba(0,0,0,${black_overlay})` }}>
                                                                        <OsuTooltip title={`${approval_state[map?.beatmap?.ranked] ?? ''}`}>
                                                                            <Box>
                                                                                {
                                                                                    map?.beatmap?.ranked === 1 || map?.beatmap?.ranked === 2 ?
                                                                                        <CheckIcon sx={{ color: green[500] }} />
                                                                                        : map?.beatmap?.ranked === 3 ?
                                                                                            <CheckIcon sx={{ color: yellow[500] }} />
                                                                                            : map?.beatmap?.ranked === 4 ?
                                                                                                <FavoriteIcon sx={{ color: red[500] }} />
                                                                                                : <QuestionMarkIcon sx={{ color: grey[500] }} />
                                                                                }
                                                                            </Box>
                                                                        </OsuTooltip>
                                                                    </TableCell>
                                                                    <TableCell sx={{ backgroundColor: `rgba(0,0,0,${black_overlay})` }}>{map.beatmap ? `${map.beatmap.beatmapset.artist} - ${map.beatmap.beatmapset.title} [${map.beatmap.version}]` : map.beatmap_id}</TableCell>
                                                                    <TableCell width={'5%'} sx={{ backgroundColor: `rgba(0,0,0,${black_overlay})` }} align='right'>{map.count}</TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid2>
                    </Grid2>
                </Box>
            </>
        </>
    );
}

export default RouteChat;