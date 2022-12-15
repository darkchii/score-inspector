import { AppBar, Box, Chip, Container, Grid, Link, List, ListItem, Toolbar, Typography } from '@mui/material';
import moment from 'moment/moment';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { redirect } from 'react-router-dom/dist';
import { CHANGETYPES, updates } from '../updates';

function Update() {
    const [update, setUpdate] = useState(null);
    const params = useParams();

    useEffect(() => {
        if (updates[updates.length - params.id] !== undefined) {
            setUpdate(updates[updates.length - params.updateId]);
        }
    }, []);

    return (
        <>
            {
                update !== null ? <>
                    <Typography variant='title'>{update.version}</Typography>
                    <Typography component='h6'>{update.date} ({moment(update.date).fromNow()})</Typography>
                    <List dense>
                        {
                            update.changes.map((change, index) => {
                                let _typeText = '';
                                let _typeColor = 'primary';
                                switch (change[0]) {
                                    case CHANGETYPES.NEW:
                                        _typeText = 'New';
                                        _typeColor = 'success';
                                        break;
                                    case CHANGETYPES.FIX:
                                        _typeText = 'Fix';
                                        _typeColor = 'secondary';
                                        break;
                                    case CHANGETYPES.REMOVE:
                                        _typeText = 'Remove';
                                        _typeColor = 'error';
                                        break;
                                    default:
                                    case CHANGETYPES.MISC:
                                        _typeText = 'Misc';
                                        _typeColor = 'primary';
                                        break;
                                }
                                return (
                                    <ListItem>
                                        <Grid container>
                                            <Grid item xs={0.75} md={0.75}>
                                                <Chip color={_typeColor} size="small" label={_typeText} />
                                            </Grid>
                                            <Grid item xs={1} md={1}>
                                                {
                                                    change[2] ?
                                                        <><Link target='_blank' href={`https://github.com/darkchii/score-inspector/commit/${change[2]}`}><Chip size="small" label={change[2].substr(0, 7)} /></Link> </>
                                                        : <></>
                                                }
                                            </Grid>
                                            <Grid item xs={10.25} md={10.25}>
                                                {change[1]}
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </> : <>
                    <Typography variant='title'>No update found</Typography>
                </>
            }
        </>
    );
}

export default Update;