import { Divider, Grid2, Paper, Stack, Typography } from "@mui/material";
import { GetFormattedName } from "../Helpers/Account.js";
import { Link as RouterLink } from 'react-router-dom';
import Loader from "./UI/Loader.js";
import Error from "./UI/Error.js";

function TodayTopPlayers(props) {
    if (!props.data) return <>
        <Loader />
    </>;

    if (props.data.error) return <>
        <Error />
    </>

    return <>
        <Grid2 container spacing={2} sx={{ pt: 1 }}>
            {
                Object.keys(props.data).map((key, index) => {
                    return (
                        <Grid2 size={{ xs: 12, md: 12 / Object.keys(props.data).length }}>
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
                                                    <Grid2 container>
                                                        <Grid2 size={1}>
                                                            <Typography variant='body2' align='center'>
                                                                {v.rank}
                                                            </Typography>
                                                        </Grid2>
                                                        <Grid2 size={7.8}>
                                                            <RouterLink to={`user/${v.user.inspector_user.osu_id}`}>
                                                                {GetFormattedName(v.user.inspector_user, { is_link: true })}
                                                            </RouterLink>
                                                        </Grid2>
                                                        <Grid2 size={3.2}>
                                                            <Typography variant='body2' align='right'>
                                                                {v.value_formatter.replace('{value}', parseInt(v.value).toLocaleString('en-US'))}
                                                            </Typography>
                                                        </Grid2>
                                                    </Grid2>
                                                </>
                                            )
                                        })
                                    }
                                </Stack>
                            </Paper>
                        </Grid2>
                    )
                })
            }
        </Grid2>
    </>
}

export default TodayTopPlayers;