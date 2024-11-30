import { Box, Card, CardContent, Grid2, Input, InputAdornment, Modal, Stack } from "@mui/material";
import { useEffect, useImperativeHandle, useRef } from "react";
import { forwardRef } from "react";
import { useState } from "react";
import { findUsers } from "../../Helpers/OsuAlt";
import { useNavigate } from "react-router";
import PlayerCard from "../PlayerCard";
import SearchIcon from '@mui/icons-material/Search';
import { sleep } from "../../Helpers/Misc.js";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
};

function UserSearchModal(props, ref) {
    const [open, setOpen] = useState(false);
    const [resultList, setResultList] = useState([]);
    const [searchVal, setSearchVal] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        searchInputRef?.current?.focus();
    }, [searchInputRef]);

    useEffect(() => {
        if (!isSearching) {
            if (searchVal.length < 3) return;
            const delayDebounceFn = setTimeout(() => {
                setIsSearching(true);
                (async () => {
                    setResultList([]);
                    //wait 500ms before searching
                    await sleep(500);
                    const res = await findUsers(searchVal);
                    setResultList(res ?? []);
                    setIsSearching(false);
                    searchInputRef?.current?.focus();
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
                    <Card sx={{ borderRadius: '10px' }}>
                        <CardContent>
                            <Stack spacing={2} direction='column'>
                                <Box sx={{ display: 'flex', height: '4rem' }}>
                                    <Input
                                        autoFocus={true}
                                        ref={searchInputRef}
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
                                    <Grid2 container spacing={1}>
                                        {
                                            resultList.map((user, index) => (
                                                <Grid2 size={{ xs: 12, md: 6, lg: 4 }} sx={{ height: '160px' }}>
                                                    <PlayerCard onClick={() => { navigate(`/user/${user.user_id}`); setOpen(false); }} user={user} />
                                                </Grid2>
                                            ))
                                        }
                                    </Grid2>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Modal>
        </>
    )
}

export default forwardRef(UserSearchModal);