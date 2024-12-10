import { Box, Card, CardContent, Grid2, TableBody, Table, TableCell, TableContainer, TableHead, TableRow, Typography, Alert, tableCellClasses } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { GetAPI } from "../Helpers/Misc";
import { GetFormattedName } from "../Helpers/Account";
import { osu_modes } from "../Helpers/Osu";

function Completionists() {
    const [completionists, setCompletionists] = useState([]);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`${GetAPI()}users/osu/completionists`);
            setCompletionists(data);
        })();
    }, []);
    return (
        (<Box>
            <h1>osu! completionists</h1>
            <Grid2 container spacing={2}>
                {
                    //just map 0-4 (osu modes)
                    [...Array(4).keys()].map((mode, i) => {
                        return (
                            (<Grid2 key={i} size={{ xs: 12, md: 6, lg: 3 }}>
                                <Card>
                                    <CardContent>
                                        {
                                            // osu_modes[mode].completion_badge
                                        }
                                        {/* <img src={osu_modes[mode].completion_badge} alt={`${osu_modes[mode].name} badge`} /> */}
                                        {/* show badge at top right corner of parent, aligned with the title */}
                                        <Box style={{
                                            display: 'flex',
                                        }}>
                                            <Typography variant="h6">osu!{['standard', 'taiko', 'catch', 'mania'][mode]}</Typography>
                                            <img src={osu_modes[mode].completion_badge} alt={`${osu_modes[mode].name} badge`} style={{
                                                marginLeft: 'auto',
                                            }} />
                                        </Box>
                                        <TableContainer sx={{
                                            mt: 2,
                                        }}>
                                            <Table size="small" sx={{
                                                [`& .${tableCellClasses.root}`]: {
                                                    borderBottom: "none"
                                                }
                                            }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>User</TableCell>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell>Scores</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        //select where mode is the current mode, order by completion date and then scores count
                                                        completionists.filter((user) => user.mode === mode).sort((a, b) => a.scores - b.scores).sort((a, b) => new Date(a.completion_date) - new Date(b.completion_date)).map((user) => {
                                                            return (
                                                                // <Typography>{GetFormattedName(user.user.inspector_user)}</Typography>
                                                                (<TableRow key={user.user.osu_id}>
                                                                    <TableCell>{GetFormattedName(user.user.inspector_user)}</TableCell>
                                                                    <TableCell>{user.completion_date}</TableCell>
                                                                    <TableCell>{user.scores.toLocaleString('en-US')}</TableCell>
                                                                </TableRow>)
                                                            );
                                                        })
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            </Grid2>)
                        );
                    })
                }
            </Grid2>
            <Alert severity="info">
                A collection of users who played every ranked map in a specific mode available at the time of their completion. This list is manually updated and may not be up to date.
                <br />
                Some score counts are estimates from the day they were completed due to missing information.
                <br />
                List also includes users not recognized by the official osu! website.
            </Alert>
        </Box>)
    );
}

export default Completionists;