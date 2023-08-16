import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import Loader from '../Components/UI/Loader';
import axios from 'axios';
import { GetAPI } from '../Helpers/Misc';
import moment from 'moment';
import { GetFormattedName } from '../Helpers/Account';
import { IMG_SVG_GRADE_A, IMG_SVG_GRADE_S, IMG_SVG_GRADE_X, SVG_GRADE_A } from '../Helpers/Assets';

function Milestones() {
    const [milestones, setMilestones] = useState([]);
    const [isWorking, setIsWorking] = useState(false);

    useEffect(() => {
        if (isWorking) return;
        (async () => {
            setIsWorking(true);
            try {
                const data = await axios.get(`${GetAPI()}scores/milestones`);
                setMilestones(data.data);
            } catch (err) {

            }

            setIsWorking(false);
        })();
    }, []);

    return (
        <>
            {
                isWorking ? (
                    <Loader />
                ) : (
                    <>
                        <TableContainer>
                            <Table size='small'>
                                <TableBody>
                                    {
                                        milestones.map((milestone, index) => {
                                            let text = 'Test';

                                            switch (milestone.achievement) {
                                                default:
                                                    text = `Unknown, contact Amayakase, this should not happen (achievement: ${milestone.achievement})`;
                                                    break;
                                                case 'Clears':
                                                    text = (<span>Reached {<span style={{ fontWeight: 'bold' }}>{milestone.count.toLocaleString('en-US')}</span>} clears</span>);
                                                    break;
                                                case 'Total SS':
                                                    text = (<span>Reached {<span style={{ fontWeight: 'bold' }}>{milestone.count.toLocaleString('en-US')}</span>} total SS ranks</span>);
                                                    break;
                                                case 'Total S':
                                                    text = (<span>Reached {<span style={{ fontWeight: 'bold' }}>{milestone.count.toLocaleString('en-US')}</span>} total S ranks</span>);
                                                    break;
                                                case 'A':
                                                    text = (<span>Reached {<span style={{ fontWeight: 'bold' }}>{milestone.count.toLocaleString('en-US')}</span>} A ranks</span>);
                                                    break;
                                                case 'Total Score':
                                                    text = (<span>Reached {<span style={{ fontWeight: 'bold' }}>{milestone.count.toLocaleString('en-US')}</span>} total score</span>);
                                                    break;
                                                case 'Ranked Score':
                                                    text = (<span>Reached {<span style={{ fontWeight: 'bold' }}>{milestone.count.toLocaleString('en-US')}</span>} ranked score</span>);
                                                    break;
                                                case 'PP':
                                                    text = (<span>Reached {<span style={{ fontWeight: 'bold' }}>{milestone.count.toLocaleString('en-US')}</span>}pp</span>);
                                                    break;
                                            }

                                            return (
                                                <TableRow>
                                                    <TableCell width='15%'>{moment(milestone.time).fromNow()}</TableCell>
                                                    <TableCell width='15%'>{GetFormattedName(milestone.inspector_user)}</TableCell>
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