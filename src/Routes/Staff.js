import { useEffect, useState } from "react";
import { GetRemoteRoles, GetRemoteUsersByRole, GetRoleIcon } from "../Helpers/Account";
import { Card, CardContent, CardHeader, Chip, Grid, Stack, Typography } from "@mui/material";
import PlayerCard from "../Components/PlayerCard";
import { useNavigate } from "react-router-dom/dist";
import { getFullUser } from "../Helpers/Osu";
import Loader from "../Components/UI/Loader";
import { Helmet } from "react-helmet";
import config from "../config.json";

function Staff(props) {
    const [roles, setRoles] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            let _roles = await GetRemoteRoles();
            if (_roles) {
                //remove roles if is_listed is false

                _roles = _roles.filter(role => role.is_listed);

                let _added_ids = [];
                for await (let role of _roles) {
                    const users = await GetRemoteUsersByRole(role.id);
                    //get full user data

                    const user_ids = users.map(user => user.osu_id);
                    let _users = [];
                    for await (let user_id of user_ids) {
                        //if user is already in any of the roles, skip
                        if (_added_ids.includes(user_id)) {
                            continue;
                        }

                        const user = await getFullUser(user_id, {
                            skipDailyData: true,
                            skipAltData: true,
                        });
                        if (user) {
                            _users.push(user);
                            _added_ids.push(user_id);
                        }
                    }

                    if (_users) {
                        role.users = _users;
                    }
                }
                setRoles(_roles);
            }
        })();
    }, []);

    return (
        <>
            <Helmet>
                <title>Staff - {config.APP_NAME}</title>
            </Helmet>
            <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
                {
                    roles ?
                        roles.map((role, i) => {
                            return (
                                <Grid>
                                    <Card>
                                        <CardHeader title={<Chip sx={{ m: 0.2, backgroundColor: `#${role.color}aa` }} icon={GetRoleIcon(role)} label={role.title} />} />
                                        <CardContent>
                                            <Grid container spacing={1} sx={{
                                                px: 2
                                            }}>
                                                {
                                                    role.users && role.users.length > 0 ?
                                                        role.users?.map((user, index) => (
                                                            <Grid item xs={12} md={6} lg={4} sx={{ height: '160px', mt: 1 }}>
                                                                <PlayerCard onClick={() => { navigate(`/user/${user.osu.id}`); }} user={user} />
                                                            </Grid>
                                                        )) : <>
                                                            <Typography variant="body1">No users found.</Typography>
                                                        </>
                                                }
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })
                        : <>
                            <Loader />
                        </>
                }
            </Stack>
        </>
    );
}

export default Staff;