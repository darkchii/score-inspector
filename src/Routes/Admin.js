import { useEffect, useState } from "react";
import { AdminGetUsers, AdminValidate, GetRemoteRoles, GetRoleIcon } from "../Helpers/Account";
import { Alert, Button, ButtonGroup, Grid, ListItem, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Loader from "../Components/UI/Loader";
import { List } from "react-virtualized";
import ImageIcon from '@mui/icons-material/Image';
import HideImageIcon from '@mui/icons-material/HideImage';
import { green, red } from "@mui/material/colors";
import { Helmet } from "react-helmet";
import config from "../config.json";
import PeopleIcon from '@mui/icons-material/People';

const NAV_WIDTH = 3;
function Admin(props) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const [currentTool, setTool] = useState(0);

    const ADMIN_TOOLS = [
        {
            name: 'Roles',
            component: <AdminRoles />,
            url: 'roles'
        },
        {
            name: 'Users',
            component: <AdminUsers />,
            url: 'users'
        }
    ]

    useEffect(() => {
        const index = ADMIN_TOOLS.findIndex((tool) => tool.url === params.tool);
        if (index !== -1) {
            setTool(index);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.tool]);

    useEffect(() => {
        (async () => {
            const _isAdmin = await AdminValidate();
            setIsAdmin(_isAdmin);
            setIsLoading(false);
        })();
    }, []);

    return (
        <>
            <Helmet>
                <title>Admin - {config.APP_NAME}</title>
            </Helmet>
            {
                isLoading ?
                    <Loader />
                    :
                    <>
                        {
                            isAdmin ?
                                <>
                                    <Grid container spacing={2}>
                                        <Grid item xs={NAV_WIDTH}>
                                            <ButtonGroup orientation="vertical" fullWidth>
                                                {
                                                    ADMIN_TOOLS.map((tool, index) => {
                                                        return (
                                                            <Button component={Link} to={`/admin/${tool.url}`} variant={index === currentTool ? 'contained' : 'outlined'}>{tool.name}</Button>
                                                        )
                                                    })
                                                }
                                            </ButtonGroup>
                                        </Grid>
                                        <Grid item xs={12 - NAV_WIDTH}>
                                            {ADMIN_TOOLS[currentTool].component}
                                        </Grid>
                                    </Grid>
                                </>
                                :
                                <Alert severity="error">You are not an admin.</Alert>
                        }
                    </>
            }
        </>
    );
}

function AdminRoles(props) {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        (async () => {
            const _roles = await GetRemoteRoles();
            setRoles(_roles);
        })();
    }, []);

    return (
        <>
            {
                roles.length > 0 ?
                    <>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    {
                                        roles.map((role) => {
                                            return (
                                                <TableRow>
                                                    <TableCell>{role.id}</TableCell>
                                                    <TableCell>{role.title}</TableCell>
                                                    <TableCell>{role.description}</TableCell>
                                                    <TableCell>{GetRoleIcon(role)}</TableCell>
                                                </TableRow>
                                            )
                                        })

                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                    : <Loader />
            }
        </>
    )
}

function AdminUsers(props) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            const _users = await AdminGetUsers();
            setUsers(_users);
        })();
    }, []);

    const listRenderer = ({ index, key, style }) => {
        const user = users[index];
        return (
            <ListItem key={key} style={{
                ...style,
                backgroundColor: `rgba(0,0,0,0.4)`,
                borderRadius: '5px'
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                        <Typography variant="subtitle1">#{user.id}</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'left' }}>
                        <Typography variant="subtitle1">{user.known_username}</Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'left' }}>
                        <Typography variant="subtitle1">({user.osu_id})</Typography>
                    </Grid>
                    <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'left' }}>
                        <Typography variant="subtitle1">
                            {
                                user.background_image ?
                                    <ImageIcon sx={{ color: green[400] }} />
                                    :
                                    <HideImageIcon sx={{ color: red[400] }} />
                            }
                            {
                                user.is_friends_public ?
                                    <PeopleIcon sx={{ color: green[400] }} />
                                    :
                                    <PeopleIcon sx={{ color: red[400] }} />
                            }</Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'left' }}>
                        <Typography variant="subtitle1">{user.roles.length} roles</Typography>
                    </Grid>
                </Grid>
            </ListItem>
        )
    }

    return (
        <>
            {
                users?.length > 0 ?
                    <>
                        <List
                            width={800}
                            height={600}
                            rowRenderer={listRenderer}
                            rowCount={users?.length}
                            rowHeight={40}
                        />
                    </>
                    : <Loader />
            }
        </>
    )
}

export default Admin;