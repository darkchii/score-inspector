/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Pagination, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import Loader from '../Components/UI/Loader';
import axios from 'axios';
import { GetAPI, MILESTONES_FORMATTER } from '../Helpers/Misc';
import moment from 'moment';
import { GetFormattedName } from '../Helpers/Account';
import { Link, useNavigate, useParams } from 'react-router';

const MILESTONES_PER_PAGE = 50;

function RouteMilestones() {
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

                //filter out milestones that have no inspector user
                const milestones = _milestones.filter(m => m.inspector_user);

                setPageCount(Math.ceil(_stats.recorded_milestones / MILESTONES_PER_PAGE));

                setMilestoneCount(_stats);
                setMilestones(milestones);
            } catch (err) {
                console.error(err);
            }

            setIsWorking(false);
        })();
    }, [page]);

    useEffect(()=>{
        window.onTitleChange('Score Rank History');
    }, []);

    return (
        <>
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

                                            let formatter = MILESTONES_FORMATTER.find(m => m.name === milestone.achievement);
                                            if (!formatter) {
                                                text = `Unknown, contact Amayakase, this should not happen (achievement: ${milestone.achievement})`;
                                            } else {
                                                text = formatter.getText(formatter.getValue(Number(milestone.count)));
                                            }

                                            return (
                                                <TableRow key={index}>
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

export default RouteMilestones;