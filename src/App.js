import { Alert, Box, CardContent, CssBaseline, Paper, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import './App.css';
import Theme from './Data/Theme';
import Root from './Routes/Root';
import Header from './Components/Header';
import Error from './Routes/Error';
import Footer from './Components/Footer';
import Update from './Routes/Update';
import User from './Routes/User';
import Leaders from './Routes/Leaders';
import { loadSettings } from './Helpers/Settings';
import Top from './Routes/Top';
import Stats from './Routes/Stats';
import { IsUserLoggedIn } from './Helpers/Account';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetAPI, showNotification } from './Helpers/Misc';
import Logout from './Routes/Logout';
import config from './config';
import Tools from './Routes/Tools';
import { Helmet } from 'react-helmet';
import { getFullUser } from './Helpers/Osu';
import Population from './Routes/Population';
import Staff from './Routes/Staff';
import Admin from './Routes/Admin';
import LeadersScore from './Routes/LeadersScore';
import Milestones from './Routes/Milestones';
import LeadersMonthly from './Routes/LeadersMonthly.js';
import Completionists from './Routes/Completionists.js';
import Clan from './Routes/Clan.js';
import Loader from './Components/UI/Loader.js';
import Chat from './Routes/Chat.js';
import Tournaments from './Routes/Tournaments.js';
import { Route, Routes } from 'react-router';

function App() {
  const [loginData, setLoginData] = useState(null);
  const [, setRefresher] = useState(0);
  const [isServerAccessible, setIsServerAccessible] = useState(null);

  useEffect(() => {
    (async () => {
      //ping the server to see if it's accessible
      try {
        const res = await fetch(`${GetAPI()}ping`);
        if (res && res.status) {
          setIsServerAccessible(true);
        }
      } catch (e) {
        console.error(e);
        setIsServerAccessible(false);
        return;
      }

      if (await IsUserLoggedIn()) {
        let loginData = {
          token: localStorage.getItem('auth_token'),
          user_id: localStorage.getItem('auth_osu_id'),
          username: localStorage.getItem('auth_username'),
        }
        setLoginData(loginData);

        showNotification('Logged in!', `Welcome, ${localStorage.getItem('auth_username')}!`, 'success');

        //also store the general user data (osu, inspector etc)
        let user;
        try {
          user = await getFullUser(loginData.user_id);
        } catch (e) {
          console.error(e);
        }

        if (!user) {
          showNotification('Warning', 'Unable to get your osu! account data. This may affect some features of the site.', 'warning');
        } else {
          loginData.osu_user = user;
          setLoginData(loginData);
        }
      }
    })();

    loadSettings();
    const onSettings = () => { setRefresher(Math.random()); };
    window.addEventListener('settings', onSettings);
    return () => { window.removeEventListener('settings', onSettings); };
  }, []);

  const basePage = (
    <>

      <Box>
        <Header account={loginData} />
      </Box>
      <Paper sx={{
        backgroundColor: `${Theme.palette.background.paper}dd`, 
        //no top border-radius
        borderRadius: 0,
      }}>
        <CardContent>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="update/:id" element={<Update />} />
            <Route path="*" element={<Error />} />
            <Route path="user/:id/:page?" element={<User />} />
            <Route path="top" element={<Top />} />
            <Route path="stats" element={<Stats />} />
            <Route path="staff" element={<Staff />} />
            <Route path="population" element={<Population />} />
            <Route path="completionists" element={<Completionists />} />
            <Route path="logout" element={<Logout />} />
            <Route path="clan/:id?" element={<Clan />} />
            <Route path="tournaments/:id?" element={<Tournaments />} />
            <Route path="bancho" element={<Chat />} />
            {/* <Route path="beatmaps/:id?" element={<Beatmap />} />
            <Route path="beatmaps/query/:query?" element={<Beatmap />} /> */}
            <Route path="milestones" element={<Milestones />}>
              <Route index element={<Milestones />} />
              <Route path="page/:page" element={<Milestones />} />
            </Route>
            <Route path="admin" element={<Admin />}>
              <Route index element={<Admin />} />
              <Route path=":tool" element={<Admin />} />
            </Route>
            <Route path="tools" element={<Tools />}>
              <Route index element={<Tools />} />
              <Route path=":tool" element={<Tools />} />
            </Route>
            <Route path="month_score" element={<LeadersMonthly />} />
            <Route path="score" element={<LeadersScore />}>
              <Route index element={<LeadersScore />} />
              <Route path="page/:page" element={<LeadersScore />}>
                <Route index element={<LeadersScore />} />
                <Route path="date/:date" element={<LeadersScore />}>
                  <Route index element={<LeadersScore />} />
                  <Route path="sort/:sort" element={<LeadersScore />}>
                    <Route index element={<LeadersScore />} />
                    <Route path="mode/:mode" element={<LeadersScore />} />
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route path="leaderboard" element={<Leaders />}>
              <Route index element={<Leaders />} />
              <Route path="stat/:stat" element={<Leaders />}>
                <Route index element={<Leaders />} />
                <Route path="page/:page" element={<Leaders />}>
                  <Route index element={<Leaders />} />
                  <Route path="country/:country" element={<Leaders />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </CardContent>
      </Paper>
      <Box sx={{ pb: 2 }}>
        <Footer />
      </Box>
    </>
  );

  return (
    <>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <Helmet>
          <style>
            {`
              body { 
              background-image: url(''); 
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;
              background-attachment: fixed;
          }`}
          </style>
        </Helmet>
        {
          config.USE_DEV_API && <>
            <Alert severity="warning">
              <Typography variant="h6" component="div">
                <Box fontWeight="fontWeightBold">
                  WARNING: You are using the development API!
                </Box>
              </Typography>
            </Alert>
          </>
        }
        <ToastContainer hideProgressBar />
        {/* <RouterProvider router={router} /> */}
        {
          isServerAccessible === null ?
            <Box sx={{
              //expand height to fill the screen
              height: '100vh',
              display: 'flex',
            }}>
              <Loader />
            </Box> : (
              isServerAccessible === false ? (
                <Box sx={{ p: 2 }}>
                  <Alert severity="error">
                    <Typography variant="h6" component="div">
                      <Box fontWeight="fontWeightBold">
                        The server is currently not accessible. Please try again later.
                        <br />
                        osu!alternative Discord: <a href="https://discord.gg/VZWRZZXcW4" target="_blank" rel="noreferrer">https://discord.gg/VZWRZZXcW4</a>
                      </Box>
                    </Typography>
                  </Alert>
                </Box>
              ) : basePage
            )
        }
      </ThemeProvider>
    </>
  );
}

export default App;