import { Box, Pagination, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import Loader from '../Components/UI/Loader';
import axios from 'axios';
import { GetAPI } from '../Helpers/Misc';
import moment from 'moment';
import { GetFormattedName } from '../Helpers/Account';
import { Link, useNavigate, useParams } from 'react-router-dom';

const MILESTONES_PER_PAGE = 50;

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
                                            let valueText = (<span style={{ fontWeight: 'bold' }}>{milestone.count.toLocaleString('en-US')}</span>);
                                            let text = '';

                                            switch (milestone.achievement) {
                                                default:
                                                    text = `Unknown, contact Amayakase, this should not happen (achievement: ${milestone.achievement})`;
                                                    break;
                                                case 'Global Rank':
                                                    text = (<span>Reached top #{valueText}</span>);
                                                    break;
                                                case 'Level':
                                                    text = (<span>Reached level {valueText}</span>);
                                                    break;
                                                case 'Playcount':
                                                    text = (<span>Reached {valueText} playcount</span>);
                                                    break;
                                                case 'Playtime':
                                                    valueText = (<span style={{ fontWeight: 'bold' }}>{moment.duration(milestone.count, 'seconds').asHours()}</span>);
                                                    text = (<span>Reached {valueText} hours of playtime</span>);
                                                    break;
                                                case 'Clears':
                                                    text = (<span>Reached {valueText} clears</span>);
                                                    break;
                                                case 'Total SS':
                                                    text = (<span>Reached {valueText} total SS ranks</span>);
                                                    break;
                                                case 'Total S':
                                                    text = (<span>Reached {valueText} total S ranks</span>);
                                                    break;
                                                case 'Silver SS':
                                                    text = (<span>Reached {valueText} silver SS ranks</span>);
                                                    break;
                                                case 'Silver S':
                                                    text = (<span>Reached {valueText} silver S ranks</span>);
                                                    break;
                                                case 'Gold SS':
                                                    text = (<span>Reached {valueText} gold SS ranks</span>);
                                                    break;
                                                case 'Gold S':
                                                    text = (<span>Reached {valueText} gold S ranks</span>);
                                                    break;
                                                case 'A':
                                                    text = (<span>Reached {valueText} A ranks</span>);
                                                    break;
                                                case 'Total Score':
                                                    text = (<span>Reached {valueText} total score</span>);
                                                    break;
                                                case 'Ranked Score':
                                                    text = (<span>Reached {valueText} ranked score</span>);
                                                    break;
                                                case 'PP':
                                                    text = (<span>Reached {valueText}pp</span>);
                                                    break;
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