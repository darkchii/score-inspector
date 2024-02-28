import { AppBar, Avatar, Box, Button, Divider, IconButton, InputBase, List, ListItem, ListItemButton, Menu, Toolbar, Typography, alpha, styled } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { PNG_GUEST } from "../Assets";
import { useState } from "react";
import { Link } from "react-router-dom";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

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

function Header() {
    const [activeDropDownIndex, setActiveDropDownIndex] = useState(-1);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [anchorElDropDown, setAnchorElDropDown] = useState(null);

    const headerItems = [
        {
            name: 'Scores', dropDown: [
                { name: 'Leaderboards' },
            ],
        }, {
            name: 'Beatmaps', linkTo: '/beatmaps'
        }
    ]

    const selectDropDown = (event, index) => {
        setActiveDropDownIndex(index);
        setIsDropDownOpen(index >= 0);
        setAnchorElDropDown(index >= 0 ? event.currentTarget : null);

        console.log('selectDropDown', index);
    }

    return (
        <>
            <HeaderButtonMenu
                anchorEl={anchorElDropDown}
                open={isDropDownOpen}
                onClose={() => selectDropDown(null, -1)}
            >
                <List>
                    {
                        activeDropDownIndex >= 0 ? headerItems[activeDropDownIndex].dropDown.map((item, index) => {
                            return (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton>
                                        {item.name}
                                    </ListItemButton>
                                </ListItem>
                            )
                        }) : <></>
                    }
                </List>
            </HeaderButtonMenu>
            <Box flexGrow={1}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            sx={{ display: { xs: 'none', sm: 'block', textDecoration: 'none', color: 'inherit' } }}
                            to="/"
                        >
                            osu! scores inspector
                        </Typography>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search player…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                        <Box sx={{ flexGrow: 1 }}>
                            {
                                headerItems.map((item, index) => {
                                    //button, add down/up arrow if dropdown
                                    return (
                                        <>
                                            <Button
                                                key={index}
                                                color="inherit"
                                                onClick={(e) => { if (item.dropDown?.length > 0) { selectDropDown(e, index); } }}
                                                component={item.linkTo ? Link : undefined}
                                                to={item.linkTo}
                                                >
                                                {item.name}
                                                {
                                                    item.dropDown?.length > 0 ? <>
                                                        <KeyboardArrowDownIcon />
                                                    </> : <></>
                                                }
                                            </Button>
                                        </>
                                    )
                                })
                            }
                        </Box>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <HeaderUserSection />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )
}

function HeaderUserSection(props) {
    const setShowMenu = (e) => {

    }
    return (
        <>
            <IconButton onClick={(e) => setShowMenu(e.currentTarget)} sx={{ p: 0 }}>
                {/* <IconButton onClick={(e) => setShowMenu(e.currentTarget)} sx={{ p: 0 }}> */}
                <Avatar alt='' src={props.account ? `https://a.ppy.sh/${props.account.user_id}` : PNG_GUEST} />
            </IconButton>
        </>
    )
}

export default Header;