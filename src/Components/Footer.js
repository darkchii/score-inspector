import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import React from 'react';

function Footer() {
    return (
        <>
            <Box>
                <AppBar position="static">
                    <Toolbar>
                        <Typography>Website made by Amayakase</Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
}

export default Footer;