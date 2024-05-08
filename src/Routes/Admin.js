import { useEffect, useState } from "react";
import { AdminGetUsers, AdminValidate, GetRemoteRoles, GetRoleIcon } from "../Helpers/Account";
import { Alert, Box, Button, ButtonGroup, Grid, ListItem, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Loader from "../Components/UI/Loader";
import ImageIcon from '@mui/icons-material/Image';
import HideImageIcon from '@mui/icons-material/HideImage';
import { green, red } from "@mui/material/colors";
import { Helmet } from "react-helmet";
import config from "../config.json";
import PeopleIcon from '@mui/icons-material/People';
import { AutoSizer, Column, Table as VTable } from 'react-virtualized';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const NAV_WIDTH = 2;
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
                    <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                        <Typography variant="subtitle1">#{(user.osu_user?.global_rank.toLocaleString('en-US')) ?? '-'}</Typography>
                    </Grid>
                    <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'left' }}>
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
                        {/* <List
                            width='100%'
                            height={800}
                            rowRenderer={listRenderer}
                            rowCount={users?.length}
                            rowHeight={40}
                        /> */}
                        <Box sx={{
                            width: '100%',
                            height: 680
                        }}>
                            <Typography variant='h6'>Inspector Users</Typography>
                            {/* active users have a global_rank */}
                            <Typography variant='subtitle1'>Registered: {(users?.length).toLocaleString('en-US')}, active: {(users.filter(u => u.osu_user?.global_rank).length).toLocaleString('en-US')}</Typography>
                            <Box sx={{
                                mt: 2
                            }} />
                            <AutoSizer>
                                {({ width, height }) => (
                                    <VTable
                                        width={width}
                                        height={height}
                                        headerHeight={20}
                                        rowHeight={30}
                                        rowCount={users.length}
                                        rowGetter={({ index }) => users[index]}
                                    >
                                        <Column label='ID' dataKey='id' width={50} cellRenderer={({ cellData }) => `#${cellData}`} />
                                        <Column label='Rank' dataKey='osu_user' cellDataGetter={({ rowData }) => rowData.osu_user?.global_rank} width={100} cellRenderer={({ cellData }) => `#${(cellData?.toLocaleString('en-US') ?? '-')}`} />
                                        <Column label='PP' dataKey='osu_user.pp' cellDataGetter={({ rowData }) => rowData.osu_user?.pp} width={100} cellRenderer={({ cellData }) => `${(cellData?.toLocaleString('en-US') ?? '-')}pp`} />
                                        <Column label='Username' dataKey='known_username' width={200} cellRenderer={({ cellData }) => `${cellData}`} />
                                        <Column label='ID' dataKey='osu_id' width={100} cellRenderer={({ cellData }) => `(${cellData})`} />
                                        <Column label='Roles' dataKey='roles' width={100} cellRenderer={({ cellData }) => `${cellData.length} roles`} />
                                        <Column label='Prefs' dataKey='' width={100}
                                            cellRenderer={({ rowData }) => (
                                                <>
                                                    {
                                                        rowData.background_image ?
                                                            <ImageIcon sx={{ color: green[400] }} />
                                                            :
                                                            <HideImageIcon sx={{ color: red[400] }} />
                                                    }
                                                    {
                                                        rowData.is_friends_public ?
                                                            <PeopleIcon sx={{ color: green[400] }} />
                                                            :
                                                            <PeopleIcon sx={{ color: red[400] }} />
                                                    }
                                                    {
                                                        rowData.is_banned ?
                                                            <BlockIcon sx={{ color: red[400] }} />
                                                            :
                                                            <CheckCircleOutlineIcon sx={{ color: green[400] }} />
                                                    }
                                                </>
                                            )}
                                        />
                                    </VTable>
                                )}
                            </AutoSizer>
                        </Box>
                    </>
                    : <Loader />
            }
        </>
    )
}

export default Admin;