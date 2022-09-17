import { CssBaseline, Box, AppBar, Toolbar, Typography, Paper, Grid, CircularProgress, Tabs, Tab, Alert, AlertTitle, Divider } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import './App.css';
import './Tabs.js';
import TabPanel from './Tabs.js';
import PagePerDay from './Tabs/PagePerDate';
import PageGeneral from './Tabs/PageGeneral';
import PageScores from './Tabs/PageScores';
import Footer from './Components/Footer';
import FileSelector from './Components/FileSelector';
import config from './config.json';
import { processFile } from './scoresProcessing';
import PageCompletion from './Tabs/PageCompletion';
import PageChangelog from './Tabs/PageChangelog';
import PageIndividualDate from './Tabs/PageIndividualDate';
import DefaultTheme from './Themes/Default';
import PagePacks from './Tabs/PagePacks';
import PageLanding from './Tabs/PageLanding';

const darkTheme = createTheme(DefaultTheme);

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

  const [tabValue, setTabValue] = React.useState(1);

  const tabs = [
    { name: 'Home', component: <PageLanding /> },
    { name: 'Changelog', component: <PageChangelog /> },
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

  const handleScoresUpload = async (file, allowLoved) => {
    setLoadState(true);
    setUser(null);
    setProcessedData(null);
    setScoreData(null);
    setUserProcessing(false);

    var complete = 0;
    await processFile(file, allowLoved,
      processed => { setProcessedData(processed); },
      user => {
        setUser(user);
        setUserProcessing(user.isWorking);
      },
      scores => { setScoreData(scores); },
      () => {
        complete++; if (complete === 3) {
          setLoadState(false);
          if (tabValue === 1) setTabValue(3);
        }
      });
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              osu! scores visualizer
            </Typography>
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
          {/* <Tab label="Home" {...a11yProps(0)} />
          <Tab label="Changelog" {...a11yProps(1)} />
          <Tab disabled={!(scoreData != null && user != null && processedData != null)} label="General" {...a11yProps(2)} />
          <Tab disabled={!(scoreData != null && user != null && processedData != null)} label="Completion" {...a11yProps(3)} />
          <Tab disabled={!(scoreData != null && user != null && processedData != null)} label="Packs" {...a11yProps(4)} />
          <Tab disabled={!(scoreData != null && user != null && processedData != null)} label="Scores" {...a11yProps(5)} />
          <Tab disabled={!(scoreData != null && user != null && processedData != null)} label="Per Day" {...a11yProps(6)} />
          <Tab disabled={!(scoreData != null && user != null && processedData != null)} label="Per Month" {...a11yProps(7)} /> */}
        </Tabs>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Toolbar />


          <Paper>
            <Grid container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ py: 2, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPositionY: "center", backgroundImage: `url("${(user !== undefined && user !== null ? user.cover_url : "null")}")` }}
            >
              <FileSelector sx={{ width: '60%' }} data={{ hasProcessedData: processedData !== null }} handleScoresUpload={handleScoresUpload} loadState={loadState} />
            </Grid>
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
                <TabPanel value={tabValue} index={index+1}>
                  <br />
                  {
                    (tab.useData ? (scoreData != null && user != null && processedData != null) : true) ? tab.component : <></>
                  }
                </TabPanel>
              ))
            }
            {/* <TabPanel value={tabValue} index={1}>
              <br />
              <PageLanding />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <br />
              <PageChangelog />
            </TabPanel>
            {(scoreData != null && user != null && processedData != null) ? <>
              <TabPanel value={tabValue} index={3}>
                <br />
                <PageGeneral data={{ scores: scoreData, user: user, processed: processedData }} />
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <br />
                <PageCompletion data={{ scores: scoreData, user: user, processed: processedData }} />
              </TabPanel>
              <TabPanel value={tabValue} index={5}>
                <br />
                <PagePacks data={{ scores: scoreData, user: user, processed: processedData }} />
              </TabPanel>
              <TabPanel value={tabValue} index={6}>
                <br />
                <PageScores data={{ scores: scoreData, user: user, processed: processedData }} />
              </TabPanel>
              <TabPanel value={tabValue} index={7}>
                <br />
                <PageIndividualDate data={{ scores: scoreData, user: user, processed: processedData }} />
              </TabPanel>
              <TabPanel value={tabValue} index={8}>
                <br />
                <PagePerDay data={{ scores: scoreData, user: user, processed: processedData, format: 'month' }} />
              </TabPanel>
            </> : <></>} */}
            <Footer sx={{ px: 3, my: 1 }} />
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;