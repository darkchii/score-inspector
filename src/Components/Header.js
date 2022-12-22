import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import SettingsModal from './Modals/SettingsModal';
import UserSearchModal from './Modals/UserSearchModal';
import SearchIcon from '@mui/icons-material/Search';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import SettingsIcon from '@mui/icons-material/Settings';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

function Header() {
    const searchElement = useRef(null);
    const settingsElement = useRef(null);

    return (
        <>
            <UserSearchModal ref={searchElement} />
            <SettingsModal ref={settingsElement} />
            <Box>
                <AppBar position="static">
                    <Container>
                        <Toolbar disableGutters>
                            <Typography variant='h6' noWrap component={Link} to={`/`} sx={{
                                mr: 2,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}>osu! scores inspector</Typography>
                            <Box sx={{ flexGrow: 1 }}>
                                <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
                                    <Button startIcon={<SearchIcon />} onClick={() => searchElement.current.setOpen(true)}>Search</Button>
                                    <Button startIcon={<LeaderboardIcon />} component={Link} to={'/leaderboard'}>Leaderboards</Button>
                                    <Button startIcon={<SportsEsportsIcon />} component={Link} to={'/beatmaps'}>Beatmaps</Button>
                                    <Button startIcon={<SettingsIcon />} onClick={() => settingsElement.current.setOpen(true)}>Settings</Button>
                                </Stack> 
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </Box>
        </>
    );
}

export default Header;