import { Box, Button, Chip, Grid, Link, List, ListItem, Typography } from '@mui/material';
import moment from 'moment/moment';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CHANGETYPES, updates } from '../updates';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

function Update() {
    const [update, setUpdate] = useState(null);
    const [canMove, setCanMove] = useState([false, false]);
    const params = useParams();
    const navigate = useNavigate();

    const fn_update = () => {
        if(isNaN(params.id)) {
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