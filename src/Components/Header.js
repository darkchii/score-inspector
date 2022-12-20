import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import SettingsModal from './Modals/SettingsModal';
import UserSearchModal from './Modals/UserSearchModal';

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
                                <Button onClick={() => searchElement.current.setOpen(true)}>Search</Button>
                                <Button component={Link} to={'/leaderboard'}>Leaderboards</Button>
                                <Button onClick={() => settingsElement.current.setOpen(true)}>Settings</Button>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </Box>
        </>
    );
}

export default Header;