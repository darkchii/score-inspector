import { CssBaseline, Box, AppBar, Toolbar, Typography, Paper, Grid, CircularProgress, Tabs, Tab, Alert, AlertTitle, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import './Tabs.js';
import TabPanel from './Tabs.js';
import PagePerDay from './Tabs/PagePerDate';
import PageGeneral from './Tabs/PageGeneral';
import PageScores from './Tabs/PageScores';
import Footer from './Components/Footer';
import { processUser } from './scoresProcessing';
import PageCompletion from './Tabs/PageCompletion';
import PageChangelog from './Tabs/PageChangelog';
import PageIndividualDate from './Tabs/PageIndividualDate';
import DefaultTheme from './Themes/Default';
import ChiiTheme from './Themes/Chii';
import PinkTheme from './Themes/Pink';
import PagePacks from './Tabs/PagePacks';
import PageLanding from './Tabs/PageLanding';
import { updates } from './updates';
import PageBeatmaps from './Tabs/PageBeatmaps';
import Snowfall from 'react-snowfall';

const themes = [
  ChiiTheme,
  DefaultTheme,
  PinkTheme,
]

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function App() {
  const [scoreData, setScoreData] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [processedData, setProcessedData] = React.useState(null);
  const [loadState, setLoadState] = React.useState(false);
  const [isUserProcessing, setUserProcessing] = React.useState(false);
  const [processError, setProcessError] = React.useState(null);
  const [currentTheme, setCurrentTheme] = React.useState(0);
  const persistentData = []; //this data remains the entire session, until refresh

  const [snowMode, setSnowMode] = React.useState(JSON.parse(window.localStorage.getItem('snowMode')));

  const [tabValue, setTabValue] = React.useState(1);

  const handleScoresFetch = async (username, allowLoved) => {
    setLoadState(true);
    setUser(null);
    setProcessedData(null);
    setScoreData(null);
    setUserProcessing(false);

    await processUser(username, allowLoved,
      (data) => {
        setUser(data.user);
        setUserProcessing(data.user.isWorking);
        setProcessedData(data.processed);
        setScoreData(data.scores);
        setLoadState(false);
        setProcessError(null);
        if (tabValue === 1) setTabValue(4);
      },
      (error) => {
        setLoadState(false);
        setProcessError(error);
      });
  }

  const tabs = [
    { name: 'Home', component: <PageLanding data={{ hasProcessedData: processedData !== null, processError: processError, persistentData: persistentData, processed: processedData }} handleScoresFetch={handleScoresFetch} loadState={loadState} /> },
    { name: 'Changelog', component: <PageChangelog /> },
    { name: 'Beatmaps', component: <PageBeatmaps data={{ persistentData: persistentData }} /> },
    { name: 'General', component: <PageGeneral data={{ scores: scoreData, user: user, processed: processedData }} />, useData: true },
    { name: 'Scores', component: <PageScores data={{ scores: scoreData, user: user, processed: processedData }} />, useData: true },
    { name: 'Completion', component: <PageCompletion data={{ scores: scoreData, user: user, processed: processedData }} />, useData: true },
    { name: 'Packs', component: <PagePacks data={{ scores: scoreData, user: user, processed: processedData }} />, useData: true },
    { name: 'Per Day', component: <PageIndividualDate data={{ scores: scoreData, user: user, processed: processedData }} />, useData: true },
    { name: 'Per Month', component: <PagePerDay data={{ scores: scoreData, user: user, processed: processedData, format: 'month' }} />, useData: true },
  ]

  const tabHandleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const themeHandleChange = (event, newValue) => {
    window.localStorage.setItem('themeID', JSON.stringify(newValue));
    setCurrentTheme(newValue);
  };

  const snowHandleChange = (event) => {
    setSnowMode(event.target.checked);
  };

  useEffect(() => {
    window.localStorage.setItem('snowMode', JSON.stringify(snowMode));
  }, [snowMode]);

  useEffect(() => {
    themeHandleChange(null, JSON.parse(window.localStorage.getItem('themeID')) ?? 0);
    setSnowMode(JSON.parse(window.localStorage.getItem('snowMode')));
  }, []);

  return (
    <>
      {
        snowMode && <Snowfall style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
        }} />
      }
      <ThemeProvider theme={createTheme(themes[currentTheme])}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
              >
                osu! scores visualizer {updates[0].version}
              </Typography>
              <FormGroup>
                <FormControlLabel control={<Switch onChange={snowHandleChange} checked={snowMode} />} label="Snow" />
              </FormGroup>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>Theme</InputLabel>
                <Select>
                  {
                    themes.map((theme, index) => (
                      <MenuItem key={index} value={index} onClick={(e) => themeHandleChange(e, index)}>{theme.themeName}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Toolbar>
          </AppBar>
          <Tabs
            orientation="vertical"
            position="fixed"
            variant="scrollable"
            value={tabValue}
            onChange={tabHandleChange}
            sx={{ borderRight: 1, borderColor: 'divider', minHeight: '100%', minWidth: '10rem' }}
          >
            <Toolbar />
            {
              tabs.map((tab, index) => (
                <Tab label={tab.name} {...a11yProps(index)} disabled={tab.useData ? !(scoreData != null && user != null && processedData != null) : false} />
              ))
            }
          </Tabs>
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Toolbar />


            <Paper>
              <Grid container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="top"
                sx={{
                  py: 2,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPositionY: "center",
                  backgroundImage: `url("${(user !== undefined && user !== null ? user.cover_url : "null")}")`,
                  minHeight: `${(user !== undefined && user !== null ? '30vh' : '0vh')}`
                }
                }
              ></Grid>
              {loadState ? <>
                <br />
                <Grid container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ pb: 1 }}>
                  <CircularProgress />
                </Grid>
              </> : <></>}
            </Paper>
            {
              isUserProcessing ? <>
                <Grid container sx={{ p: 2 }} direction="column" alignItems="center">
                  <Grid item xs={12} md={6} lg={6}>
                    <Alert severity="warning">
                      <AlertTitle>Warning</AlertTitle>
                      The scorefetcher isn't done checking all of your scores yet! The data is most likely incomplete. ({isUserProcessing.percentage.toFixed(2)}% done)
                    </Alert>
                  </Grid>
                </Grid>
              </> : <></>
            }
            <Grid>
              {
                tabs.map((tab, index) => (
                  <TabPanel value={tabValue} index={index + 1}>
                    <br />
                    {
                      (tab.useData ? (scoreData != null && user != null && processedData != null) : true) ? tab.component : <></>
                    }
                  </TabPanel>
                ))
              }
              <Footer sx={{ px: 3, my: 1 }} />
            </Grid>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;