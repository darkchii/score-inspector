import { Box, Button, Chip, Grid, Link, List, ListItem, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import moment from 'moment/moment';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CHANGETYPES, PLATFORMTYPES, updates } from '../Data/Updates';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Helmet } from 'react-helmet';
import config from "../config.json";

function Update() {
    const [update, setUpdate] = useState(null);
    const [canMove, setCanMove] = useState([false, false]);
    const [reversedUpdates] = useState(updates.slice().reverse());
    const params = useParams();
    const navigate = useNavigate();

    const fn_update = () => {
        if (isNaN(params.id)) {
            return;
        }
        const _id = Number(params.id);
        if (reversedUpdates[_id - 1] !== undefined) {
            setUpdate(reversedUpdates[_id - 1]);
        }
        let _canMove = [false, false];
        if (_id > 0) {
            _canMove[0] = _id - 1;
        }
        if (params.id < reversedUpdates.length) {
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
            <Helmet>
                <title>Changelog - {config.APP_NAME}</title>
            </Helmet>
            {
                update !== null ? <>
                    <Box>
                        <Button disabled={!canMove[0]} onClick={() => navigate(`/update/${canMove[0]}`)} size='small'><KeyboardDoubleArrowLeftIcon /></Button>
                        <Typography sx={{ display: 'inline-block', mt: 1 }} component='h4' variant='title'>{update.version}</Typography>
                        <Button disabled={!canMove[1]} onClick={() => navigate(`/update/${canMove[1]}`)} size='small'><KeyboardDoubleArrowRightIcon /></Button>
                    </Box>
                    <Grid sx={{ p: 1 }}>
                        {
                            reversedUpdates && reversedUpdates.map((update, index) => {
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
                    <Table size="small">
                        <TableBody>
                            {update.changes.map((change, index) => {
                                let _typeText = '';
                                let _platformTexts = [];
                                let _typeColor = 'primary';

                                if (change[0] & PLATFORMTYPES.WEB) {
                                    _platformTexts.push('Web');
                                }

                                if (change[0] & PLATFORMTYPES.API) {
                                    _platformTexts.push('API');
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
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                {_platformTexts.map((_platformText, i) => (
                                                    <Chip key={i} size="small" label={_platformText} />
                                                ))}
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip color={_typeColor} size="small" label={_typeText} />
                                        </TableCell>
                                        <TableCell>
                                            {change[3] && (
                                                <>
                                                    <Link target="_blank" href={`https://github.com/darkchii/score-inspector/commit/${change[3]}`}>
                                                        <Chip size="small" label={change[3].substr(0, 7)} />
                                                    </Link>
                                                </>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ width: '100%' }}>
                                            {change[2]}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </> : <>
                    <Typography variant='title'>No update found</Typography>
                </>
            }
        </>
    );
}

export default Update;