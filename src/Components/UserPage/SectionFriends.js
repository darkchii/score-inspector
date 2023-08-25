/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../UI/Loader";
import axios from "axios";
import { GetAPI } from "../../Helpers/Misc";
import { Grid } from "@mui/material";
import PlayerCard from "../PlayerCard";
import { useNavigate } from "react-router-dom";

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
                    <Grid container spacing={1}>
                        {friends.map((friend, index) => {
                            return (
                                <Grid item xs={12} md={6} lg={3} sx={{ height: '80px' }}>
                                    <PlayerCard onClick={() => { navigate(`/user/${friend.osu.id}`); }} user={friend} />
                                </Grid>
                            )
                        })}
                    </Grid>
                </>
            }
        </>
    );
}

export default SectionFriends;