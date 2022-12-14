import { Card, CardContent, Grid, Link, Typography } from "@mui/material";
import React from "react";
import config from '../config.json';

function Footer(props) {
    return (
        <>
            <Grid sx={props.sx} container spacing={3}>
                <Grid item xs={12} sm={12} md={12}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="subtitle1">Website made by Amayakase</Typography>
                            <Typography variant="subtitle1">
                                <Link target="_blank" rel="noreferrer" href="https://osu.ppy.sh/users/10153735">osu!</Link>&nbsp;&bull;&nbsp;
                                <Link target="_blank" rel="noreferrer" href="https://twitter.com/id2amayakase">Twitter</Link>&nbsp;&bull;&nbsp;
                                <Link target="_blank" rel="noreferrer" href="https://github.com/darkchii/score-inspector">Source code</Link>
                                {
                                    config.DONATE_URL ? <>&nbsp;&bull;&nbsp;<Link target="_blank" rel="noreferrer" href={config.DONATE_URL}>Donate</Link></> : <></>
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
export default Footer;