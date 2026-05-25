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
                        <br />
                        <Typography variant="body1">osu! scores inspector has been temporarily shut down in favor of the upcoming 3.0 rewrite, and the following:</Typography>
                        <Typography variant="body1">The IP address that hosts this server, and is my personal IP, has been banned by peppy at the moment due to causing extreme loads on the osu! web server.</Typography>
                        <Typography variant="body1">There is no clear date for when we will be back up with the complete rewrite, as I cannot work on it right now and am not willing to ban evade to access osu! api.</Typography>
                        <br /><Typography variant="body1">Join the osu!alt Discord for updates on this situation (and project).</Typography>
                        <br /><br />
                        <Typography variant="body1">
                          The reason for the ban is likely my teams fetcher (I just want to be clear on this), which does NOT use the API, but scrapes the website.<br />
                          <a href="https://kirino.sh/teams/" target="_blank" rel="noreferrer">https://kirino.sh/teams/</a><br />
                          It worked as follows:<br />
                          - Scrape the team leaderboards to find new teams (all modes)<br />
                          - For each team, scrape the team page (only if not updated recently, say 24h) to get all members (THIS HAS AN API ENDPOINT NOW, but never got to implementing it)<br />
                          - Each team update also gets the team flag image, to generate a team color based on it (this is likely the thing that caused the load)<br />
                          - For each member, call the API to get all mode stats (50 per call)<br />
                          - Generate team stats based on the member stats<br />
                          - Rinse and repeat
                        </Typography><br />
                        <Typography variant="body1">
                          This system has been running for a year or so, but AI scrapers likely caused peppy to crack down on it.<br />
                          I have plans for a new system that will get rid of the scraping, but not sure how this will look yet.<br/><br/>
                          Just putting this here so you are aware of what is up.
                        </Typography>
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