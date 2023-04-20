import { Box, Button, Chip, Grid, Link, List, ListItem, Stepper, Typography } from '@mui/material';
import moment from 'moment/moment';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CHANGETYPES, PLATFORMTYPES, updates } from '../updates';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

function Update() {
    const [update, setUpdate] = useState(null);
    const [canMove, setCanMove] = useState([false, false]);
    const params = useParams();
    const navigate = useNavigate();

    const fn_update = () => {
        if (isNaN(params.id)) {
            return;
        }
        const _id = Number(params.id);
        if (updates[updates.length - _id] !== undefined) {
            setUpdate(updates[updates.length - _id]);
        }
        let _canMove = [false, false];
        if (_id > 0) {
            _canMove[0] = _id - 1;
        }
        if (params.id < updates.length) {
            _canMove[1] = _id + 1;
        }
        setCanMove(_canMove);
    }

    useEffect(() => {
        fn_update();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fn_update();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    return (
        <>
            {
                update !== null ? <>
                    <Box>
                        <Button disabled={!canMove[0]} onClick={() => navigate(`/update/${canMove[0]}`)} size='small'><KeyboardDoubleArrowLeftIcon /></Button>
                        <Typography sx={{ display: 'inline-block', mt: 1 }} component='h4' variant='title'>{update.version}</Typography>
                        <Button disabled={!canMove[1]} onClick={() => navigate(`/update/${canMove[1]}`)} size='small'><KeyboardDoubleArrowRightIcon /></Button>
                    </Box>
                    <Grid sx={{ p: 1 }}>
                        {
                            updates.reverse().map((update, index) => {
                                const id = index + 1;
                                return (
                                    <Button
                                        size='small'
                                        variant={id === Number(params.id) ? 'contained' : 'outlined'}
                                        onClick={() => navigate(`/update/${id}`)}>{update.version}</Button>
                                );
                            })
                        }
                    </Grid>
                    <Typography component='h6'>{update.date} ({moment(update.date).fromNow()})</Typography>
                    <List dense>
                        {
                            update.changes.map((change, index) => {
                                let _typeText = '';
                                let _platformText = '';
                                let _typeColor = 'primary';
                                switch (change[0]) {
                                    default:
                                    case PLATFORMTYPES.WEB:
                                        _platformText = 'Web';
                                        break;
                                    case PLATFORMTYPES.API:
                                        _platformText = 'API';
                                        break;
                                }
                                switch (change[1]) {
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
                                            <Grid item xs={0.6} md={0.6}>
                                                <Chip size="small" label={_platformText} />
                                            </Grid>
                                            <Grid item xs={0.6} md={0.6}>
                                                <Chip color={_typeColor} size="small" label={_typeText} />
                                            </Grid>
                                            <Grid item xs={1} md={1}>
                                                {
                                                    change[3] ?
                                                        <><Link target='_blank' href={`https://github.com/darkchii/score-inspector/commit/${change[3]}`}><Chip size="small" label={change[3].substr(0, 7)} /></Link> </>
                                                        : <></>
                                                }
                                            </Grid>
                                            <Grid item xs={9.8} md={9.8}>
                                                {change[2]}
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