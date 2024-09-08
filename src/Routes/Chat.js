import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import config from "../config.json";
import { Alert, Box, Card, CardContent, Container, Grid2, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatNumberAsSize, GetAPI } from "../Helpers/Misc";
import StatCard from "../Components/UI/StatCard";
import { pink } from "@mui/material/colors";
import Loader from "../Components/UI/Loader";
import { GetFormattedName } from "../Helpers/Account";
import ChartWrapper from "../Helpers/ChartWrapper";
import WordCloud from "../Components/UI/WordCloud";

function Chat(props) {
    const [isWorking, setIsWorking] = useState(false);
    const [chatStats, setChatStats] = useState(null);
    const [chatHistory, setChatHistory] = useState(null);
    const [activeUsers, setActiveUsers] = useState(null);
    const [popularWords, setPopularWords] = useState(null);
    const theme = useTheme();

    const getStats = async () => {
        const data = await axios.get(`${GetAPI()}chatlog/stats`);
        if (data?.data) {
            setChatStats(data.data);
        }
    }

    const getHistory = async () => {
        const data = await axios.get(`${GetAPI()}chatlog/hourly_count`);
        if (data?.data) {
            const graph_data = data.data.map((item) => {
                return [new Date(item.hour), item.message_count];
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

    useEffect(() => {
        (async () => {
            if (isWorking) return;
            setIsWorking(true);
            await getStats();
            await getHistory();
            await getActiveUsers();
            await getPopularWords();
            setIsWorking(false);
        })();
    }, []);

    if (isWorking || !chatStats || !chatHistory || !activeUsers || !popularWords) {
        return <Loader />;
    }

    return (
        <>
            <Helmet>
                <title>Chat - {config.APP_NAME}</title>
            </Helmet>
            <>
                <Container>
                    <Alert severity="info">These are statistics of the public osu! bancho chats. Tracking all messages since September 8, 2024. Language chats are NOT tracked.</Alert>
                    <Grid2 container spacing={1} sx={{ mt: 1 }}>
                        <Grid2 size={2}>
                            <StatCard title="Messages" stats={chatStats?.message_count} color={pink} />
                        </Grid2>
                        <Grid2 size={2}>
                            <StatCard title="Players" stats={chatStats?.unique_users} color={pink} />
                        </Grid2>
                        <Grid2 size={2}>
                            <StatCard tooltip={'Events are triggered by commands (/np, /me)'} title="Event messages" stats={chatStats?.event_count} color={pink} />
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
                                                        activeUsers?.map((user) => {
                                                            return (
                                                                <TableRow>
                                                                    <TableCell>{GetFormattedName(user.user.inspector_user)}</TableCell>
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
                                        <Typography variant="h6">Messages per hour</Typography>
                                        <Box sx={{ width: '100%', height: '250px' }}>
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
                                                            format: 'MMM dd yyyy HH:mm',
                                                        },
                                                    },
                                                    tooltip: {
                                                        x: {
                                                            format: 'MMM dd yyyy HH:mm',
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
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                                <Card elevation={3}>
                                    <CardContent>
                                        <Typography variant="h6">Popular words</Typography>
                                        <WordCloud data={popularWords} />
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid2>
                    </Grid2>
                </Container>
            </>
        </>
    );
}

export default Chat;