import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { Alert, Box, CardContent, CssBaseline, Paper, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import Theme from './Data/Theme';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { loadSettings } from './Helpers/Settings';
import { IsUserLoggedIn } from './Helpers/Account';
import { ToastContainer } from 'react-toastify';
import { GetAPI, showNotification } from './Helpers/Misc';
import config from './config';
import { Helmet } from 'react-helmet';
import { getFullUser } from './Helpers/Osu';
import Loader from './Components/UI/Loader';
import { Route, Routes } from 'react-router';

import RouteIndex from './Routes/RouteIndex';
import RouteError from './Routes/RouteError';
import RouteUpdate from './Routes/RouteUpdate';
import RouteUser from './Routes/RouteUser';
import RouteLeaders from './Routes/RouteLeaders';
import RouteTop from './Routes/RouteTop';
import RouteStats from './Routes/RouteStats';
import RouteLogout from './Routes/RouteLogout';
import RouteTools from './Routes/RouteTools';
import RouteStaff from './Routes/RouteStaff';
import RouteAdmin from './Routes/RouteAdmin';
import RouteLeadersScore from './Routes/RouteLeadersScore';
import RouteMilestones from './Routes/RouteMilestones';
import RouteLeadersMonthly from './Routes/RouteLeadersMonthly';
import RouteCompletionists from './Routes/RouteCompletionists';
import RouteWrapped from './Routes/RouteWrapped';
import RouteClan from './Routes/RouteClan';

function App() {
  const [loginData, setLoginData] = useState(null);
  const [, setRefresher] = useState(0);
  const [isServerAccessible, setIsServerAccessible] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [title, setTitle] = useState(null);

  useEffect(() => {
    (async () => {
      setIsWorking(true);
      //ping the server to see if it's accessible
      try {
        const res = await fetch(`${GetAPI()}ping`);
        if (res && res.status) {
          setIsServerAccessible(true);
        }
      } catch (e) {
        console.error(e);
        setIsServerAccessible(false);
        setIsWorking(false);
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
      setIsWorking(false);
    })();

    loadSettings();
    const onSettings = () => { setRefresher(Math.random()); };
    window.addEventListener('settings', onSettings);
    return () => { window.removeEventListener('settings', onSettings); };
  }, []);

  window.onTitleChange = (title) => {
    setTitle(title);
  }

  const routes = [
    { path: '/', element: <RouteIndex />, },
    { path: 'update/:id', element: <RouteUpdate />, },
    { path: '*', element: <RouteError />, },
    { path: 'user/:id/:page?', element: <RouteUser />, },
    { path: 'top', element: <RouteTop />, },
    { path: 'stats', element: <RouteStats />, },
    { path: 'staff', element: <RouteStaff />, },
    { path: 'completionists', element: <RouteCompletionists />, },
    { path: 'logout', element: <RouteLogout />, },
    { path: 'clan/:id?/:page?', element: <RouteClan />, },
    { path: 'wrapped/:id?', element: <RouteWrapped />, },
    {
      path: 'milestones', element: <RouteMilestones />,
      children: [
        { path: 'page/:page', element: <RouteMilestones /> },
      ]
    },
    { path: 'admin/:tool?', element: <RouteAdmin /> },
    { path: 'tools/:tool?', element: <RouteTools /> },
    { path: 'month_score', element: <RouteLeadersMonthly />, },
    {
      path: 'score', element: <RouteLeadersScore />,
      children: [
        {
          path: 'page/:page', element: <RouteLeadersScore />,
          children: [
            {
              path: 'date/:date', element: <RouteLeadersScore />,
              children: [
                {
                  path: 'sort/:sort', element: <RouteLeadersScore />,
                  children: [
                    {
                      path: 'mode/:mode', element: <RouteLeadersScore />
                    },
                  ]
                },
              ]
            },
          ]
        }
      ]
    },
    {
      path: 'leaderboard', element: <RouteLeaders />,
      children: [
        {
          path: 'stat/:stat', element: <RouteLeaders />,
          children: [
            {
              path: 'page/:page', element: <RouteLeaders />,
              children: [
                {
                  path: 'country/:country', element: <RouteLeaders />
                }
              ]
            }
          ]
        }
      ]
    }
  ]

  const getRoute = (obj, is_child = false) => {
    return <>
      {
        is_child && <Route
          onTitleChange={(title) => setTitle(title)}
          index
          element={obj.element}
        />
      }
      <Route
        key={obj.path}
        path={obj.path}
        element={obj.element}
      >
        {
          obj.children && obj.children.map((child) => getRoute(child, true))
        }
      </Route>
    </>
  }

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
            {
              routes.map((route) => getRoute(route))
            }
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
          <title>
            {title ? `${title} - ` : ''} {config.APP_NAME}
          </title>
        </Helmet>
        {
          isWorking ? <Loader /> :
            <>
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
            </>
        }
      </ThemeProvider>
    </>
  );
}

export default App;