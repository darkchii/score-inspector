import { AppBar, Avatar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Toolbar, Typography, alpha, styled } from '@mui/material';
import React from 'react';
import { useRef } from 'react';
import { Link } from 'react-router';
import UserSearchModal from './Modals/UserSearchModal';
import SearchIcon from '@mui/icons-material/Search';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import StarIcon from '@mui/icons-material/Star';
import BuildIcon from '@mui/icons-material/Build';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import Login from './Navigation/Login';
import { PNG_GUEST } from '../Helpers/Assets';
import AccountDropdown from './Navigation/AccountDropdown';
import CustomizeModal from './Modals/CustomizeModal';
import VisitorLogModal from './Modals/VisitorLogModal';
import MenuIcon from '@mui/icons-material/Menu';
import PublicIcon from '@mui/icons-material/Public';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import HistoryIcon from '@mui/icons-material/History';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import GroupIcon from '@mui/icons-material/Group';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import OsuTooltip from './OsuTooltip';

const HeaderButtonMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    >
        {props.children}
    </Menu>
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

function Header(props) {
    const { window } = props;
    const searchElement = useRef(null);
    const customizeElement = useRef(null);
    const visitorLogElement = useRef(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const [showMenu, setShowMenu] = React.useState(null);

    const [activeDropDownIndex, setActiveDropDownIndex] = React.useState(null);
    const [showDropDown, setShowDropDown] = React.useState(false);
    const [anchorElDropDown, setAnchorElDropDown] = React.useState(null);

    const headerNavItems = [
        {
            name: 'Search', icon: <SearchIcon />, onClick: () => searchElement.current.setOpen(true), dropDown: [
                { name: 'Staff', icon: <SupervisorAccountIcon />, onClick: () => { }, linkTo: '/staff' },
                { name: 'Completionists', icon: <MilitaryTechIcon />, onClick: () => { }, linkTo: '/completionists' },
            ],
        },
        {
            name: 'Leaderboards', icon: <LeaderboardIcon />, onClick: () => { }, linkTo: '/leaderboard', dropDown: [
                { name: 'Top Score Per Month', icon: <EmojiEventsIcon />, onClick: () => { }, linkTo: '/month_score' },
                { name: 'Historic Score Rank', icon: <HistoryIcon />, onClick: () => { }, linkTo: '/score' },
            ]
        },
        { name: 'Top Scores', icon: <StarIcon />, onClick: () => { }, linkTo: '/top' },
        { name: 'Stats', icon: <DataUsageIcon />, onClick: () => { }, linkTo: '/stats' },
        { name: 'Tools', icon: <BuildIcon />, onClick: () => { }, linkTo: '/tools' },
        { name: 'Milestones', icon: <EmojiEventsIcon />, onClick: () => { }, linkTo: '/milestones' },
        { name: 'Clans', icon: <GroupIcon />, onClick: () => { }, linkTo: '/clan' },
        // { name: 'Tournaments', icon: <EmojiEventsIcon />, onClick: () => { }, linkTo: '/tournaments' },
    ];

    const handleHeaderMenuOpen = (event, index) => {
        setActiveDropDownIndex(index);
        setShowDropDown(true);
        setAnchorElDropDown(event.currentTarget);
    };

    const handleHeaderMenuClose = () => {
        setActiveDropDownIndex(null);
        setShowDropDown(false);
        setAnchorElDropDown(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawerWidth = 240;
    const navDropDownRenderer = (
        <Box onClick={handleDrawerToggle} sx={{ p: 1 }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                osu! scores inspector
            </Typography>
            <Divider />
            <List>
                {headerNavItems.map((item, index) => (
                    <ListItem key={`${item.name}-${index}`} disablePadding>
                        {/* onClick for item.onClick or make it a Link component */}
                        {/* <ListItemButton onClick={() => item.onClick()} startIcon={item.icon}> */}
                        <ListItemButton component={Link} to={item.linkTo} startIcon={item.icon} onClick={() => item.onClick()}>
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

            <HeaderButtonMenu
                anchorEl={anchorElDropDown}
                open={showDropDown}
                onClose={handleHeaderMenuClose}
            >
                {
                    headerNavItems[activeDropDownIndex] !== undefined ? headerNavItems[activeDropDownIndex].dropDown.map((item, index) => {
                        return (
                            <MenuItem key={`${item.name}-${index}`} onClick={() => {
                                item.onClick();
                                handleHeaderMenuClose();
                            }} component={item.linkTo ? Link : null} to={item.linkTo ?? null}>
                                <ListItemIcon sx={{ minWidth: '40px' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.name} />
                            </MenuItem>
                        )
                    }) : <></>
                }
            </HeaderButtonMenu>

            <Box>
                <AppBar position="static">
                    <Box sx={{ pl: 2, pr: 2 }}>
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
                                <Stack direction="row" spacing={2}>
                                    {
                                        headerNavItems.map((item, index) => {
                                            return (
                                                <Stack key={index} direction="row">
                                                    <OsuTooltip title={item.tooltip ?? ''}>
                                                        <Button
                                                            key={index}
                                                            size='small'
                                                            startIcon={item.icon}
                                                            component={item.linkTo ? Link : null}
                                                            to={item.linkTo ?? null}
                                                            onClick={item.onClick}>
                                                            {item.name}
                                                        </Button>

                                                        {
                                                            item.dropDown ?
                                                                <IconButton onClick={(e) => handleHeaderMenuOpen(e, index)} size='small'><KeyboardArrowDownIcon /></IconButton>
                                                                : <></>
                                                        }
                                                    </OsuTooltip>
                                                </Stack>
                                            )
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
                                    sx={{ mt: '45px', pt: 0 }}
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
                    </Box>
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