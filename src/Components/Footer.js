import { AppBar, Box, Link as ALink, Toolbar, Typography, Paper, Card } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { updates } from '../updates';

function Footer() {
    return (
        <>
            <Box>
                <AppBar position="static" component={Card}>
                    <Toolbar>
                        <Typography>
                            Website made by Amayakase - <ALink href='https://twitter.com/id2amayakase' target='_blank'>Twitter</ALink> - <ALink component={Link} to={'user/10153735'}>osu!</ALink> - <ALink href='https://github.com/darkchii/score-inspector' target='_blank'>Source Code</ALink> - <ALink component={Link} to={`update/${updates.length}`}>Changelog</ALink>
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
}

export default Footer;