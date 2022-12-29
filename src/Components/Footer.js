import { AppBar, Box, Link as ALink, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <>
            <Box>
                <AppBar position="static">
                    <Toolbar>
                        <Typography>
                            Website made by Amayakase - <ALink href='https://twitter.com/id2amayakase' target='_blank'>Twitter</ALink> - <Link to={'user/10153735'}>osu!</Link> - <ALink href='https://github.com/darkchii/score-inspector' target='_blank'>Source Code</ALink>
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
}

export default Footer;