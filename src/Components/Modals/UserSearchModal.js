import { Box, Card, CardContent, Container, Grid, Input, InputAdornment, Modal, Stack, Tooltip, Typography } from "@mui/material";
import { useEffect, useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useState } from "react";
import { findUsers } from "../../Helpers/OsuAlt";
import { useNavigate } from "react-router-dom/dist";
import PlayerCard from "../PlayerCard";
import SearchIcon from '@mui/icons-material/Search';

const style = {
    position: 'absolute',
    top: '50%',
    width: '100%',
    transform: 'translate(0, -50%)',
};

function UserSearchModal(props, ref) {
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
                    setResultList(res ?? []);
                    setIsSearching(false);
                })();
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                        <Input
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            }
                                            defaultValue={searchVal}
                                            disabled={isSearching}
                                            onChange={e => setSearchVal(e.target.value)}
                                            placeholder="Search for a user"
                                            sx={{ flexGrow: 1 }} />
                                    </Box>
                                    <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                        <Grid container spacing={1}>
                                            {
                                                resultList.map((user, index) => (
                                                    <Grid item xs={4}>
                                                        <PlayerCard onClick={() => { navigate(`/user/${user.user_id}`); setOpen(false); }} user={user} />
                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
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

export default forwardRef(UserSearchModal);