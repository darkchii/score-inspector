import { Divider, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { GetFormattedName } from "../Helpers/Account.js";
import { Link as RouterLink } from 'react-router-dom';
import Loader from "./UI/Loader.js";

function TodayTopPlayers(props) {
    if (!props.data) return <>
        <Loader />
    </>;

    return <>
        <Grid container spacing={2} sx={{ pt: 1 }}>
            {
                Object.keys(props.data).map((key, index) => {
                    return (
                        <Grid xs={12} md={12 / Object.keys(props.data).length}>
                            <Paper sx={{ p: 0.5, m: 0.5 }}>
                                {/* {key} */}
                                <Typography variant='subtitle1' sx={{ mb: 1 }}>{key}</Typography>
                                <Stack spacing={0.5} sx={{ pl: 1 }}>
                                    {
                                        props.data[key].map((v, i) => {
                                            return (
                                                <>
                                                    {
                                                        v.rank > 10 && <Divider sx={{ my: 0.5 }} />
                                                    }
                                                    <Grid container>
                                                        <Grid item xs={1}>
                                                            <Typography variant='body2' align='center'>
                                                                {v.rank}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={7.8}>
                                                            <RouterLink to={`user/${v.user.inspector_user.osu_id}`}>
                                                                {GetFormattedName(v.user.inspector_user, { is_link: true })}
                                                            </RouterLink>
                                                        </Grid>
                                                        <Grid item xs={3.2}>
                                                            <Typography variant='body2' align='right'>
                                                                {v.value_formatter.replace('{value}', parseInt(v.value).toLocaleString('en-US'))}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            )
                                        })
                                    }
                                </Stack>
                            </Paper>
                        </Grid>
                    )
                })
            }
        </Grid>
    </>
}

export default TodayTopPlayers;