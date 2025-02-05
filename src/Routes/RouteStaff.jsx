import { useEffect, useState } from "react";
import { GetRemoteRoles, GetRemoteUsersByRole, GetRoleIcon } from "../Helpers/Account";
import { Card, CardContent, CardHeader, Chip, Grid2, Stack, Typography } from "@mui/material";
import PlayerCard from "../Components/PlayerCard";
import { useNavigate } from "react-router";
import { getFullUser } from "../Helpers/Osu";
import Loader from "../Components/UI/Loader";

function RouteStaff() {
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
                    const full_users = await getFullUser(user_ids, {
                        skipAltData: true,
                    }, true);

                    for (let user of full_users) {
                        if (user) {
                            _users.push(user);
                            _added_ids.push(user.osu.id);
                        }
                    }

                    if (_users) {
                        role.users = _users;
                    }
                }
                setRoles(_roles);
            }
        })();
        window.onTitleChange('Staff');
    }, []);

    return (
        <>
            <Stack direction="column" spacing={2} sx={{ mb: 2 }}>
                {
                    roles ?
                        roles.map((role, i) => {
                            return (
                                <Grid2 key={i}>
                                    <Card>
                                        <CardHeader title={<Chip sx={{ m: 0.2, backgroundColor: `#${role.color}aa` }} icon={GetRoleIcon(role)} label={role.title} />} />
                                        <CardContent>
                                            <Grid2 container spacing={1} sx={{
                                                px: 2
                                            }}>
                                                {
                                                    role.users && role.users.length > 0 ?
                                                        role.users?.map((user, index) => (
                                                            <Grid2 key={index} size={{ xs: 12, md: 4, lg: 3 }} sx={{ height: '160px', mt: 1 }}>
                                                                <PlayerCard onClick={() => { navigate(`/user/${user.osu.id}`); }} user={user} />
                                                            </Grid2>
                                                        )) : <>
                                                            <Typography variant="body1">No users found.</Typography>
                                                        </>
                                                }
                                            </Grid2>
                                        </CardContent>
                                    </Card>
                                </Grid2>
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

export default RouteStaff;