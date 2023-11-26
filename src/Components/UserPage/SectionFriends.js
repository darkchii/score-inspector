/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../UI/Loader";
import axios from "axios";
import { GetAPI } from "../../Helpers/Misc";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GetFormattedName } from "../../Helpers/Account";

function SectionFriends(props) {
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const data = (await axios.get(`${GetAPI()}login/friends/${props.user.osu.id}`))?.data;
            setFriends(data);
            setIsLoading(false);
        })();
    }, []);
    return (
        <>
            {
                isLoading ? <>
                    <Loader />
                </> : <>
                    <Grid container spacing={1} sx={{ padding: 1 }}>
                        {friends.map((friend, index) => {
                            return (
                                <Box sx={{
                                    display: 'flex',
                                    p: 0.2
                                }}>
                                    {GetFormattedName(friend.inspector_user)}
                                </Box>
                            )
                        })}
                    </Grid>
                </>
            }
        </>
    );
}

export default SectionFriends;