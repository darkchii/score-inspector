import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, Stack, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import SettingsModal from './Modals/SettingsModal';
import UserSearchModal from './Modals/UserSearchModal';
import SearchIcon from '@mui/icons-material/Search';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SettingsIcon from '@mui/icons-material/Settings';
import StarIcon from '@mui/icons-material/Star';
import BuildIcon from '@mui/icons-material/Build';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import Login from './Navigation/Login';
import { PNG_GUEST } from '../Helpers/Assets';
import AccountDropdown from './Navigation/AccountDropdown';
import CustomizeModal from './Modals/CustomizeModal';
import VisitorLogModal from './Modals/VisitorLogModal';
import MapIcon from '@mui/icons-material/Map';

function Header(props) {
    const searchElement = useRef(null);
    const settingsElement = useRef(null);
    const customizeElement = useRef(null);
    const visitorLogElement = useRef(null);

    const [showMenu, setShowMenu] = React.useState(null);

    return (
        <>
            {
                props.account !== null ? <>
                    <CustomizeModal account={props.account} ref={customizeElement} />
                    <VisitorLogModal account={props.account} ref={visitorLogElement} />
                </> : <></>
            }
            <UserSearchModal ref={searchElement} />
            <SettingsModal ref={settingsElement} />
            <Box>
                <AppBar position="static">
                    <Container maxWidth='xl'>
                        <Toolbar disableGutters>
                            <Typography variant='h6' noWrap component={Link} to={`/`} sx={{
                                mr: 2,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}>osu! scores inspector</Typography>
                            <Box sx={{ flexGrow: 1 }}>
                                <Stack direction="row" spacing={2} sx={{ display: 'flex' }}>
                                    <Button size='small' startIcon={<SearchIcon />} onClick={() => searchElement.current.setOpen(true)}>Search</Button>
                                    {/* <Button size='small' startIcon={<QueryStatsIcon />} component={Link} to={'/stats'}>Stats</Button> */}
                                    <Button size='small' startIcon={<LeaderboardIcon />} component={Link} to={'/leaderboard'}>Leaderboards</Button>
                                    {/* <Button size='small' startIcon={<SportsEsportsIcon />} component={Link} to={'/beatmaps'}>Beatmaps</Button> */}
                                    <Button size='small' startIcon={<StarIcon />} component={Link} to={'/top'}>Top Scores</Button>
                                    <Button size='small' startIcon={<DataUsageIcon />} component={Link} to={'/stats'}>Stats</Button>
                                    <Button size='small' startIcon={<MapIcon />} component={Link} to={'/beatmaps'}>Beatmaps</Button>
                                    <Button size='small' startIcon={<SettingsIcon />} onClick={() => settingsElement.current.setOpen(true)}>Settings</Button>
                                    <Button size='small' startIcon={<BuildIcon />} component={Link} to={'/tools'}>Tools</Button>
                                </Stack>
                            </Box>
                            <Box sx={{ flexGrow: 0 }}>
                                <IconButton onClick={(e) => setShowMenu(e.currentTarget)} sx={{ p: 0 }}>
                                    <Avatar alt='' src={props.account ? `https://a.ppy.sh/${props.account.user_id}` : PNG_GUEST} />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    sx={{ mt: '45px' }}
                                    keepMounted
                                    anchorEl={showMenu}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(showMenu)}
                                    onClose={() => setShowMenu(null)}
                                >
                                    <Box sx={{ width: '20em' }}>
                                        {
                                            props.account !== null ? <>
                                                <AccountDropdown 
                                                    visitorLogModal={visitorLogElement}
                                                    customizeModal={customizeElement} 
                                                    onClose={() => setShowMenu(null)} 
                                                    account={props.account} />
                                            </> : <>
                                                <Login />
                                            </>
                                        }
                                    </Box>
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </Box>
        </>
    );
}

export default Header;