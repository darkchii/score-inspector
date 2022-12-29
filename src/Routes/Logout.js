import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { LogoutUser } from "../Helpers/Account";

function Logout() {

    useEffect(() => {
        (async () => {
            const _t = localStorage.getItem('auth_token');
            const _id = localStorage.getItem('auth_osu_id');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_osu_id');
            localStorage.removeItem('auth_username');

            await LogoutUser(_t, _id);

            const redirect = window.location.href.split('?')[0];
            const _red = redirect.substring( 0, redirect.lastIndexOf( "/" ) + 1);
            window.location.href = _red;
        })();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', p: 2 }}>
            <CircularProgress />
        </Box>
    )
}

export default Logout;