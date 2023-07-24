import { AppBar, Avatar, Box, Button, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, Stack, Toolbar, Typography } from '@mui/material';
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
import MenuIcon from '@mui/icons-material/Menu';
import PublicIcon from '@mui/icons-material/Public';

function Header(props) {
    const { window } = props;
    const searchElement = useRef(null);
    const settingsElement = useRef(null);
    const customizeElement = useRef(null);
    const visitorLogElement = useRef(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const [showMenu, setShowMenu] = React.useState(null);

    const headerNavItems = [
        { name: 'Search', icon: <SearchIcon />, onClick: () => searchElement.current.setOpen(true) },
        { name: 'Leaderboards', icon: <LeaderboardIcon />, onClick: () => { }, linkTo: '/leaderboard' },
        { name: 'Top Scores', icon: <StarIcon />, onClick: () => { }, linkTo: '/top' },
        { name: 'Stats', icon: <DataUsageIcon />, onClick: () => { }, linkTo: '/stats' },
        { name: 'Settings', icon: <SettingsIcon />, onClick: () => settingsElement.current.setOpen(true) },
        { name: 'Tools', icon: <BuildIcon />, onClick: () => { }, linkTo: '/tools' },
        { name: 'Population', icon: <PublicIcon />, onClick: () => { }, linkTo: '/population' },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawerWidth = 240;
    const navDropDownRenderer = (
        <Box onClick={handleDrawerToggle} sx={{p:1}}>
            <Typography variant="h6" sx={{ my: 2 }}>
                osu! scores inspector
            </Typography>
            <Divider />
            <List>
                {headerNavItems.map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton startIcon={item.icon}>
                            <ListItemIcon sx={{ minWidth: '40px' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )

    const container = window !== undefined ? () => window().document.body : undefined;

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
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { lg: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant='h6' noWrap component={Link} to={`/`} sx={{
                                mr: 2,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}>osu! scores inspector</Typography>
                            <Box sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'block', flexGrow: 1 } }}>
                                <Stack direction="row" spacing={2} sx={{ display: 'flex' }}>
                                    {
                                        headerNavItems.map((item, index) => {
                                            if (item.linkTo) {
                                                return <Button key={index} size='small' startIcon={item.icon} component={Link} to={item.linkTo}>{item.name}</Button>
                                            } else {
                                                return <Button key={index} size='small' startIcon={item.icon} onClick={item.onClick}>{item.name}</Button>
                                            }
                                        }
                                        )
                                    }
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
                                    <Box sx={{ width: '25em' }}>
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
                <Box component="nav">
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {navDropDownRenderer}
                    </Drawer>
                </Box>
            </Box>
        </>
    );
}

export default Header;