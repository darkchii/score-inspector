import { CssBaseline, Box, AppBar, Toolbar, Typography, Paper, Grid, CircularProgress, Tabs, Tab, Tooltip, Alert, AlertTitle } from '@mui/material';
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
import { getUserTrackerStatus } from './helper';

const darkTheme = createTheme(config.theme);

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

  const tabHandleChange = (event, newValue) => {
    setTabValue(newValue);
    console.log(newValue);
  };

  const handleScoresUpload = async (file) => {
    setLoadState(true);
    setUser(null);
    setProcessedData(null);
    setScoreData(null);
    setUserProcessing(false);

    var complete = 0;
    await processFile(file,
      processed => { setProcessedData(processed); },
      user => {
        setUser(user);
        setUserProcessing(user.isWorking);
      },
      scores => { setScoreData(scores); },
      () => { complete++; if (complete === 3) { setLoadState(false); } });
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
          sx={{ borderRight: 1, borderColor: 'divider', minHeight: '100%', width: '10rem' }}
        >
          <Toolbar />
          <Tab label="General" {...a11yProps(0)} />
          <Tab label="Completion" {...a11yProps(1)} />
          <Tab label="Scores" {...a11yProps(2)} />
          <Tab label="Per Day" {...a11yProps(3)} />
          <Tooltip>
            <Tab label="Per Month" {...a11yProps(4)} />
          </Tooltip>
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
              <FileSelector sx={{ width: '60%' }} handleScoresUpload={handleScoresUpload} loadState={loadState} />
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
              <Alert severity="warning">
                <AlertTitle>Warning</AlertTitle>
                The scorefetcher isn't done checking all of your scores yet! The data is most likely incomplete. ({isUserProcessing.percentage.toFixed(2)}% done)
              </Alert>
            </> : <></>
          }
          <Grid>
            {(scoreData != null && user != null && processedData != null) ? <>
              <TabPanel value={tabValue} index={1}>
                <br />
                <PageGeneral data={{ scores: scoreData, user: user, processed: processedData }} />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <br />
                <PageCompletion data={{ scores: scoreData, user: user, processed: processedData }} />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <br />
                <PageScores data={{ scores: scoreData, user: user, processed: processedData }} />
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <br />
                <PagePerDay data={{ scores: scoreData, user: user, processed: processedData, format: 'day' }} />
              </TabPanel>
              <TabPanel value={tabValue} index={5}>
                <br />
                <PagePerDay data={{ scores: scoreData, user: user, processed: processedData, format: 'month' }} />
              </TabPanel>
            </> : <></>}
            <Footer sx={{ px: 3, my: 1 }} />
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;