import { Alert, Box, Card, CardContent, Container, CssBaseline, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import './App.css';
import Theme from './Data/Theme';
import Root from './Routes/Root';
import Header from './Components/Header';
import Error from './Routes/Error';
import Footer from './Components/Footer';
import Update from './Routes/Update';
import { Route, Routes } from 'react-router-dom/dist';
import User from './Routes/User';
import Leaders from './Routes/Leaders';
import Snowfall from 'react-snowfall';
import { getSettings, loadSettings } from './Helpers/Settings';
import Top from './Routes/Top';
import Stats from './Routes/Stats';
import Beatmaps from './Routes/Beatmaps';
import { IsUserLoggedIn } from './Helpers/Account';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showNotification } from './Helpers/Misc';
import Logout from './Routes/Logout';
import config from './config';
import Tools from './Routes/Tools';
import { Helmet } from 'react-helmet';
import CompDev from './Routes/CompDev';
import { getFullUser } from './Helpers/Osu';
import Population from './Routes/Population';
import Staff from './Routes/Staff';
import Admin from './Routes/Admin';
import LeadersScore from './Routes/LeadersScore';
import Milestones from './Routes/Milestones';
import Docs from './Routes/Docs';

function App() {
  const [loginData, setLoginData] = useState(null);
  const [, setRefresher] = useState(0);

  useEffect(() => {
    (async () => {
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
        <Box sx={{ pb: 2 }}>
          <Header account={loginData} />
        </Box>
        <Container maxWidth='xl'>
          <ToastContainer hideProgressBar />
          <Card sx={{
            backgroundColor: `${Theme.palette.background.paper}dd`,
          }}>
            <CardContent>
              {/* <RouterProvider router={router} /> */}
              <Routes>
                <Route path="/" element={<Root />} />
                <Route path="update/:id" element={<Update />} />
                <Route path="*" element={<Error />} />
                <Route path="user/:id" element={<User />} />
                <Route path="dev" element={<CompDev />} />
                <Route path="top" element={<Top />} />
                <Route path="stats" element={<Stats />} />
                <Route path="beatmaps" element={<Beatmaps />} />
                <Route path="staff" element={<Staff />} />
                <Route path="population" element={<Population />} />
                <Route path="docs" element={<Docs />} />
                <Route path="logout" element={<Logout />} />
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
                <Route path="score" element={<LeadersScore />}>
                  <Route index element={<LeadersScore />} />
                  <Route path="page/:page" element={<LeadersScore />}>
                    <Route index element={<LeadersScore />} />
                    <Route path="date/:date" element={<LeadersScore />}>
                      <Route index element={<LeadersScore />} />
                      <Route path="sort/:sort" element={<LeadersScore />} />
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
          </Card>
          <Box sx={{ pt: 2, pb: 2 }}>
            <Footer />
          </Box>
        </Container>
      </ThemeProvider>
      {
        getSettings().snowFall ?
          <Snowfall style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
          }} /> : <></>
      }
    </>
  );
}

export default App;