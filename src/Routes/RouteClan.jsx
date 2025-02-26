/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Box, Button, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { GetLoginID, GetUser } from "../Helpers/Account";
import { useNavigate, useParams } from "react-router";
import Loader from "../Components/UI/Loader";
import ClanPage from "../Components/Clans/ClanPage";
import ClanTabPanel from "../Components/Clans/ClanTabPanel";
import ClanList from "../Components/Clans/ClanList";
import ClanTop from "../Components/Clans/ClanTop";

function RouteClan() {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const params = useParams();
    const navigate = useNavigate();

    const loadUser = async (force_reload_user = false) => {
        if (loggedInUser && !force_reload_user) {
            setIsLoadingUser(false);
            return loggedInUser;
        }
        const _user = await GetLoginID();
        if (_user) {
            const __user = await GetUser(_user);
            setLoggedInUser(__user || null);
            setIsLoadingUser(false);
            return __user;
        }
        setIsLoadingUser(false);
        setLoggedInUser(false);
        return null;
    }

    useEffect(() => {
        (async () => {
            await loadUser();
        })()
    }, [params]);

    function a11yProps(index) {
        return {
            id: `clans-tab-${index}`,
            'aria-controls': `clans-tabpanel-${index}`,
        };
    }

    useEffect(() => {
        window.onTitleChange('Clans');
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (isLoadingUser) return <Loader />

    return (
        <>
            {
                params.id ?
                    <ClanPage id={params.id} me={loggedInUser} onRefreshUser={
                        async () => {
                            await loadUser(true);
                        }
                    } /> :
                    <>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Due to official teams being live now, osu! inspector clans are now archived. <br/>
                            You can still visit them here, but actions can no longer be performed. Statistics will not be updated anymore either (last updated February 20, 2025).<br/>
                            Thanks for participating!
                        </Alert>
                        <Box sx={{
                            borderBottom: 1, borderColor: 'divider',
                            //spacing in-between
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1
                        }}>
                            <Tabs value={tabValue} onChange={handleTabChange} centered sx={{
                                //grow to fill the space
                                flexGrow: 1
                            }}>
                                <Tab label="Rankings" {...a11yProps(0)} />
                                <Tab label="Listing" {...a11yProps(1)} />
                            </Tabs>

                            <Box>
                                {
                                    loggedInUser && loggedInUser.clan_member?.clan && loggedInUser.clan_member?.clan ?
                                        <Button
                                            onClick={() => navigate(`/clan/${loggedInUser.clan_member.clan.id}`)}
                                            variant='contained' color='primary' fullWidth>Go to {loggedInUser.clan_member.clan.name}</Button> :
                                        <></>
                                }

                            </Box>
                        </Box>
                        <ClanTabPanel value={tabValue} index={0}>
                            <ClanTop me={loggedInUser} />
                        </ClanTabPanel>
                        <ClanTabPanel value={tabValue} index={1}>
                            <ClanList me={loggedInUser} />
                        </ClanTabPanel>
                    </>
            }
        </>
    )
}

export default RouteClan;