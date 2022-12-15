import { Avatar, Box, Button, Card, CardContent, Container, Input, Modal, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useState } from "react";
import { findUsers } from "../Helpers/OsuAlt";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom/dist";
import ReactCountryFlag from "react-country-flag";

const style = {
    position: 'absolute',
    top: '50%',
    width: '100%',
    transform: 'translate(0, -50%)',
};

function UserSearch(props, ref) {
    const [open, setOpen] = useState(false);
    const [resultList, setResultList] = useState([]);
    const [searchVal, setSearchVal] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isSearching) {
            if (searchVal.length < 3) return;
            const delayDebounceFn = setTimeout(() => {
                setIsSearching(true);
                (async () => {
                    const res = await findUsers(searchVal);
                    console.log(res);
                    setResultList(res ?? []);
                    setIsSearching(false);
                })();
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        }
    }, [searchVal]);

    useImperativeHandle(ref, () => ({
        setOpen(value) {
            setOpen(value);
        }
    }));

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={style}>
                    <Container>
                        <Card sx={{ borderRadius: '10px' }}>
                            <CardContent>
                                <Stack spacing={2} direction='column'>
                                    <Box sx={{ display: 'flex', height: '4rem' }}>
                                        <Input defaultValue={searchVal} disabled={isSearching} onChange={e => setSearchVal(e.target.value)} placeholder="Search for a user" sx={{ flexGrow: 1 }} />
                                    </Box>
                                    <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                        <Stack direction='column' spacing={2} sx={{ m: 1 }}>
                                            {
                                                resultList.map((user, index) => (
                                                    <Box component={Paper}
                                                        onClick={() => { navigate(`/user/${user.user_id}`); setOpen(false); }}
                                                        elevation={5}
                                                        sx={{
                                                            p: 1, borderRadius: '5px', "&:hover": {
                                                                opacity: 0.9,
                                                                cursor: 'pointer'
                                                            }
                                                        }}>
                                                        <Box sx={{ textDecoration: 'none' }}>
                                                            <Stack direction='row' alignItems='center' spacing={2}>
                                                                <Avatar alt={user.username} src={`https://a.ppy.sh/${user.user_id}`} />
                                                                <ReactCountryFlag
                                                                    style={{ lineHeight: '1em', fontSize: '1.4em', borderRadius: '5px' }}
                                                                    cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/"
                                                                    countryCode={user.country_code}
                                                                    />
                                                                <Typography variant='h6' noWrap>
                                                                    {user.username}
                                                                </Typography>
                                                            </Stack>
                                                        </Box>
                                                    </Box>
                                                ))
                                            }
                                        </Stack>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Container>
                </Box>
            </Modal>
        </>
    )
}

export default forwardRef(UserSearch);