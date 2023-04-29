import { Alert, Box, Card, CardContent, Container, CssBaseline, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import './App.css';
import Theme from './Theme';
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

function App() {
  const [loginData, setLoginData] = useState(null);
  const [, setRefresher] = useState(0);

  useEffect(() => {
    (async () => {
      if (await IsUserLoggedIn()) {
        setLoginData({
          token: localStorage.getItem('auth_token'),
          user_id: localStorage.getItem('auth_osu_id'),
          username: localStorage.getItem('auth_username'),
        });

        showNotification('Logged in!', `Welcome, ${localStorage.getItem('auth_username')}!`, 'success');
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
        <Header account={loginData} />
        <Container maxWidth='xl'>
          <ToastContainer hideProgressBar />
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              {/* <RouterProvider router={router} /> */}
              <Routes>
                <Route path="/" element={<Root />} />
                <Route path="update/:id" element={<Update />} />
                <Route path="*" element={<Error />} />
                <Route path="user/:id" element={<User />} />
                <Route path="top" element={<Top />} />
                <Route path="stats" element={<Stats />} />
                <Route path="beatmaps" element={<Beatmaps />} />
                <Route path="logout" element={<Logout />} />
                <Route path="tools" element={<Tools />}>
                  <Route index element={<Tools />} />
                  <Route path=":tool" element={<Tools />} />
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
          <Footer />
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