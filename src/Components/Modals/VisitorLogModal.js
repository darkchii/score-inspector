import { Box, Card, CardContent, Container, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useState } from "react";
import { GetFormattedName, GetVisited } from "../../Helpers/Account";
import moment from "moment";
import { Link as RouterLink } from 'react-router-dom';
import { arr_sum } from "../../Helpers/Misc";

const style = {
    position: 'absolute',
    top: '50%',
    width: '100%',
    transform: 'translate(0, -50%)',
};

function VisitorLogModal(props, ref) {
    const [open, setOpen] = useState(false);
    const [visitedList, setVisitedList] = useState([]);

    useImperativeHandle(ref, () => ({
        setOpen(value) {
            setOpen(value);
        }
    }));

    useEffect(() => {
        if(!open) return;
        (async () => {
            const data = await GetVisited();
            setVisitedList(data ?? []);
        })();
    }, [open]);


    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={style}>
                    <Container>
                        <Card sx={{ borderRadius: '10px' }}>
                            <CardContent>
                                <Typography variant='h6'>Users visited</Typography>
                                <Box sx={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    <TableContainer>
                                        <Table size='small'>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>User</TableCell>
                                                    <TableCell>Last visit</TableCell>
                                                    <TableCell>Visits (Total: {visitedList ? arr_sum(visitedList, 'count') : '-'})</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    visitedList && visitedList.map((item, index) => {
                                                        return (
                                                            <TableRow>
                                                                <TableCell>
                                                                <RouterLink to={`user/${item.target_user.inspector_user.osu_id}`}>
                                                                    {GetFormattedName(item.target_user.inspector_user, {
                                                                        is_link: true
                                                                    })}
                                                                </RouterLink></TableCell>
                                                                <TableCell>{moment(item.last_visit).fromNow()}</TableCell>
                                                                <TableCell>{item.count}</TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Container>
                </Box>
            </Modal>
        </>
    )
}

export default forwardRef(VisitorLogModal);