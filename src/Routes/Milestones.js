/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Pagination, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import Loader from '../Components/UI/Loader';
import axios from 'axios';
import { GetAPI } from '../Helpers/Misc';
import moment from 'moment';
import { GetFormattedName } from '../Helpers/Account';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import config from "../config.json";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const MILESTONES_PER_PAGE = 50;

const MILESTONES = [
    {
        name: 'Global Rank',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached top #{value}</span>),
    }, {
        name: 'Level',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached level {value}</span>),
    }, {
        name: 'Playcount',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} playcount</span>)
    }, {
        name: 'Playtime',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{moment.duration(value, 'seconds').asHours()}</span>),
        getText: (value) => (<span>Reached {value} hours of playtime</span>),
    }, {
        name: 'Clears',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} clears</span>),
    }, {
        name: 'Total SS',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} total SS ranks</span>),
    }, {
        name: 'Total S',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} total S ranks</span>),
    }, {
        name: 'Silver SS',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} silver SS ranks</span>),
    }, {
        name: 'Silver S',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} silver S ranks</span>),
    }, {
        name: 'Gold SS',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} gold SS ranks</span>),
    }, {
        name: 'Gold S',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} gold S ranks</span>),
    }, {
        name: 'A',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} A ranks</span>),
    }, {
        name: 'Total Score',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} total score</span>),
    }, {
        name: 'Ranked Score',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value} ranked score</span>),
    }, {
        name: 'PP',
        getValue: (value) => (<span style={{ fontWeight: 'bold' }}>{value.toLocaleString('en-US')}</span>),
        getText: (value) => (<span>Reached {value}pp</span>),
    }
]

function Milestones() {
    const params = useParams();
    const navigate = useNavigate();

    const [page, setPage] = useState(params.page ? parseInt(params.page) : 1);

    const [milestones, setMilestones] = useState([]);
    const [milestoneStats, setMilestoneCount] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [isWorking, setIsWorking] = useState(false);

    useEffect(() => {
        if (isWorking) return;
        (async () => {
            setIsWorking(true);
            try {
                const { data: _milestones } = await axios.get(`${GetAPI()}scores/milestones?limit=${MILESTONES_PER_PAGE}&page=${page}`);
                const { data: _stats } = await axios.get(`${GetAPI()}scores/milestones/stats`);

                setPageCount(Math.ceil(_stats.recorded_milestones / MILESTONES_PER_PAGE));

                setMilestoneCount(_stats);
                setMilestones(_milestones);
            } catch (err) {
                console.error(err);
            }

            setIsWorking(false);
        })();
    }, [page]);

    return (
        <>
            <Helmet>
                <title>Milestones - {config.APP_NAME}</title>
            </Helmet>
            {
                isWorking ? (
                    <Loader />
                ) : (
                    <>
                        <Box>
                            <Box sx={{ pb: 2, justifyContent: 'center', display: 'flex' }}>
                                <Typography>
                                    Recorded milestones: {milestoneStats?.recorded_milestones?.toLocaleString('en-US') ?? 'n/a'} ({milestoneStats?.recorded_milestones_today?.toLocaleString('en-US') ?? 'n/a'} today) - Tracked players: {milestoneStats?.users?.toLocaleString('en-US') ?? 'n/a'}
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box sx={{ pb: 2, justifyContent: 'center', display: 'flex' }}>
                                <Pagination
                                    color="primary"
                                    boundaryCount={1}
                                    siblingCount={4}
                                    width='100%'
                                    page={page}
                                    onChange={(e, v) => {
                                        navigate(`/milestones/page/${v}`);
                                        setPage(v);
                                    }
                                    } count={pageCount} />
                            </Box>
                        </Box>
                        <TableContainer>
                            <Table size='small'>
                                <TableBody>
                                    {
                                        milestones.map((milestone, index) => {
                                            //let valueText = (<span style={{ fontWeight: 'bold' }}>{milestone.count.toLocaleString('en-US')}</span>);
                                            let text = '';

                                            let formatter = MILESTONES.find(m => m.name === milestone.achievement);
                                            if (!formatter) {
                                                text = `Unknown, contact Amayakase, this should not happen (achievement: ${milestone.achievement})`;
                                            } else {
                                                text = formatter.getText(formatter.getValue(milestone.count));
                                            }

                                            return (
                                                <TableRow>
                                                    <TableCell width='15%'>{moment(milestone.time).fromNow()}</TableCell>
                                                    <TableCell width='15%'>
                                                        <Link to={`/user/${milestone.user_id}`}>
                                                            {GetFormattedName(milestone.inspector_user, {
                                                                is_link: true,
                                                            })}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{text}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )
            }
        </>
    );
}

export default Milestones;