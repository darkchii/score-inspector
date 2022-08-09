import { CssBaseline, Box, AppBar, Toolbar, Typography, Button, Paper, Grid, CircularProgress, Tabs, Tab, Snackbar, Alert, Tooltip, Link, Stepper, Step, StepLabel, CardContent, Card } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect } from 'react';
import './App.css';
import Papa from "papaparse";
import './Tabs.js';
import TabPanel from './Tabs.js';
import PagePerDay from './Tabs/PagePerDate';
import PageGeneral from './Tabs/PageGeneral';
import { getModString, mods } from './helper';
import PageScores from './Tabs/PageScores';
import PhoneIcon from '@mui/icons-material/Phone';
import PageInfo from './Tabs/PageInfo';
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

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
  const [loadTitle, setLoadTitle] = React.useState('Load status');

  const [tabValue, setTabValue] = React.useState(1);

  const tabHandleChange = (event, newValue) => {
    setTabValue(newValue);
    console.log(newValue);
  };

  const processData = async (scores) => {
    (async function () { setLoadTitle("Fetching user"); })();

    let _user = await fetch(`https://darkchii.nl/osu/api.php?user_id=${scores[0].user_id}`).then((res) => res.json());
    if (_user.error !== undefined) {
      console.log(`Error fetching user: ${_user.error}`);
      setLoadState(false);
      return;
    }

    let _scoreRank = await fetch(`https://score.respektive.pw/u/${scores[0].user_id}`).then((res) => res.json());
    if (_scoreRank !== undefined) {
      _user.scoreRank = _scoreRank[0].rank;
    }

    setUser(_user);

    var processed = await CalculateData(scores, _user);
    setProcessedData(processed);

    setLoadState(false);
  };

  const testScores = (scores) => {
    let valid = true;
    scores.every(score => {
      if (score.user_id === undefined || score.beatmap_id === undefined) {
        valid = false;
        return false;
      }

      return true;
    });
    return valid;
  }

  const handleScoresUpload = async (file) => {
    setLoadState(true);
    setUser(null);
    setProcessedData(null);
    setScoreData(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        setLoadTitle("Validating scores");
        if (testScores(results.data)) {
          // console.log("Valid score dataset");
          results.data.forEach(score => {
            score.pp = Math.max(0, parseFloat(score.pp));
            score.enabled_mods = parseInt(score.enabled_mods);
            score.stars = parseFloat(score.stars);
            score.maxcombo = parseInt(score.maxcombo);
            score.combo = parseInt(score.combo);
            score.countmiss = parseInt(score.countmiss);
            score.count300 = parseInt(score.count300);
            score.count100 = parseInt(score.count100);
            score.count50 = parseInt(score.count50);
            score.score = parseInt(score.score);
            score.accuracy = parseFloat(score.accuracy);
            score.length = parseInt(score.length);
            score.bpm = parseInt(score.bpm);
            score.approved = parseInt(score.approved);
          });
          setScoreData(results.data);
          Promise.resolve(processData(results.data));
        } else {
          // console.log("Invalid score dataset!!!!!");
          setLoadState(false);
        }
      }
    });
  }

  const [stepperActiveStep, setStepperActiveStep] = React.useState(0);
  const [stepperCompleted, setStepperCompleted] = React.useState({});

  const stepperHandleBack = () => {
    setStepperActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const stepperHandleNext = () => {
    setStepperActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const stepperHandleReset = () => {
    setStepperActiveStep(0);
  };

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
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider', minHeight: '100%', width: '10rem' }}
        >
          <Toolbar />
          <Tab label="General" {...a11yProps(0)} />
          <Tab label="Scores" {...a11yProps(1)} />
          <Tooltip title="WARNING: This can take a while to generate">
            <Tab label="Per Day" {...a11yProps(2)} />
          </Tooltip>
          <Tooltip title="WARNING: This can take a while to generate">
            <Tab label="Per Month" {...a11yProps(3)} />
          </Tooltip>
          <Tab label="Info" {...a11yProps(4)} />
        </Tabs>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Toolbar />


          <Paper>
            <Grid container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ py: 2, backgroundImage: `url("${(user !== undefined && user !== null ? user.cover_url : "null")}")` }}
            >
              <Card sx={{ width: '60%' }}>
                <CardContent>
                  <Box>
                    <Stepper activeStep={stepperActiveStep}>
                      <Step key="s1">
                        <StepLabel>Join Discord</StepLabel>
                      </Step>
                      <Step key="s2">
                        <StepLabel>Fetch Scores</StepLabel>
                      </Step>
                      <Step key="s3">
                        <StepLabel>Download Scores</StepLabel>
                      </Step>
                      <Step key="s4">
                        <StepLabel>Upload</StepLabel>
                      </Step>
                    </Stepper>
                    <Typography sx={{ mt: 2, mb: 1 }}>Step {stepperActiveStep + 1}</Typography>
                    <Box sx={{ px: 5 }} alignItems="center" justifyContent="center" direction="column">
                      {
                        {
                          0: <><Typography sx={{ mt: 2, mb: 1 }}>Join the following discord: <Button href='https://discord.gg/VZWRZZXcW4' target="_blank" variant="contained" size='small'>osu!alternative</Button></Typography></>,
                          1: <><Typography sx={{ mt: 2, mb: 1 }}>Go to the #info text-channel, and do what the section "Fetching scores" says.<br />It can take a couple of hours to get all of your scores ready, depending on your stats.</Typography></>,
                          2: <><Typography sx={{ mt: 2, mb: 1 }}>To get your file, go to #bot-channel and perform the following command: <br /><code>!getfile -type scores -u username</code> - Replace username with yours. You will receive a <code>scores.csv</code> file.</Typography></>,
                          3: <><Typography sx={{ mt: 2, mb: 1 }}>Upload the downloaded <code>scores.csv</code> file here:<br /><Button variant="contained" color="success" component="label" disabled={loadState}>Upload scores<input onChange={e => handleScoresUpload(e.target.files[0])} hidden accept=".csv" type="file" /></Button></Typography></>,
                        }[stepperActiveStep]
                      }
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={stepperActiveStep === 0}
                        onClick={stepperHandleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: '1 1 auto' }} />
                      {
                        stepperActiveStep < 3 ?
                          <Button onClick={stepperHandleNext}>Next</Button>
                          : <></>
                      }
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              {/* <Typography>To get your scores, head over to the osu!alternative Discord server, and follow the guide to fetching scores.<br />
                When the fetcher is complete, run <code>!getfile -type scores</code> in the bot channel. Upload the resulting file here.<br /><br />
                <Button href='https://discord.gg/VZWRZZXcW4' target="_blank" variant="contained" size='small'>Join osu!alternative</Button>
              </Typography><br /><br />
              <Button variant="contained" color="success" component="label" disabled={loadState}>Upload scores<input onChange={e => handleScoresUpload(e.target.files[0])} hidden accept=".csv" type="file" /></Button> */}
            </Grid>
            {loadState ? <>
              <br />
              <Grid container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center">
                <CircularProgress />
                <Typography sx={{ py: 2 }}>{loadTitle}</Typography>
              </Grid>
            </> : <></>}
          </Paper>
          <Grid>
            {(scoreData != null && user != null && processedData != null) ? <>
              <TabPanel value={tabValue} index={1}>
                <br />
                <PageGeneral data={{ scores: scoreData, user: user, processed: processedData }} />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <br />
                <PageScores data={{ scores: scoreData, user: user, processed: processedData }} />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <br />
                <PagePerDay data={{ scores: scoreData, user: user, processed: processedData }} />
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <br />
                <PagePerDay data={{ scores: scoreData, user: user, processed: processedData, format: 'month' }} />
              </TabPanel>
            </> : <></>}
            <TabPanel value={tabValue} index={5}>
              <br />
              <PageInfo />
            </TabPanel>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

async function CalculateData(scores, _user) {
  var processed = {};

  const rankIndex = {
    "XH": 0,
    "X": 1,
    "SH": 2,
    "S": 3,
    "A": 4,
    "B": 5,
    "C": 6,
    "D": 7,
  };

  var ranks = [];
  ranks["XH"] = 0;
  ranks["X"] = 0;
  ranks["SH"] = 0;
  ranks["S"] = 0;
  ranks["A"] = 0;
  ranks["B"] = 0;
  ranks["C"] = 0;
  ranks["D"] = 0;
  var used_mods = [];
  var tags = [];
  var highest_sr = 0;
  console.time("total values");
  for await (const score of scores) {

    var is_fc = score.perfect === "1";

    if (!is_fc) {
      if (score.countmiss === 0 && score.maxcombo > 0) {
        const perc_fc = 100 / score.maxcombo * score.combo;
        is_fc = perc_fc >= 99;
      }
    }

    score.is_fc = is_fc;

    if (ranks[rankIndex[score.rank]] !== undefined) {
      ranks[rankIndex[score.rank]]++;
    } else {
      ranks[rankIndex[score.rank]] = 1;
    }

    score.tags.split(" ").forEach(tag => {
      // console.log(tag);
      const _tag = tag.trim().replaceAll('"', '').toString();
      if (tags[_tag] !== undefined) {
        tags[_tag]++;
      } else {
        tags[_tag] = 1;
      }
    });

    const _m = getModString(score.enabled_mods).toString();
    if (used_mods.findIndex(m => m.mods === _m) === -1) {
      used_mods.push({
        mods: _m,
        value: 1
      });
    } else {
      used_mods.forEach((m) => {
        if (m.mods === _m) {
          m.value++;
        }
      })
    }

    if (!(score.enabled_mods & mods.NF) && score.stars > highest_sr) {
      highest_sr = score.stars;
    }
  }
  console.timeEnd("total values");

  console.time("sort used mods");
  used_mods.sort((a, b) => {
    if (a.value > b.value) { return -1; }
    if (a.value < b.value) { return 1; }
    return 0;
  })
  console.timeEnd("sort used mods");

  console.time("sort tags");
  var improvedTags = [];
  for (const tag in tags) {
    improvedTags.push({
      tag: tag,
      value: tags[tag]
    });
  }

  improvedTags.sort((a, b) => {
    if (a.value > b.value) { return -1; }
    if (a.value < b.value) { return 1; }
    return 0;
  })
  console.timeEnd("sort tags");

  processed.usedMods = used_mods;
  // processed.usedTags = tags;
  processed.usedTags = improvedTags;

  processed.rankCounts = ranks;

  processed.scoreCount = scores.length;

  var total_pp = 0;
  var total_sr = 0;
  var total_fc = 0;
  var total_length = 0;
  for await (const score of scores) {
    if (!isNaN(score.length)) {
      total_length += score.length;
    }
    if (!isNaN(score.pp)) {
      total_pp += score.pp;
    }
    if (!isNaN(score.stars)) {
      total_sr += score.stars;
    }
    if (score.is_fc) {
      total_fc++;
    }
  }

  processed.total_pp = total_pp;
  processed.average_pp = total_pp / scores.length;
  processed.average_sr = total_sr / scores.length;
  processed.average_score = _user.statistics.ranked_score / scores.length;
  processed.highest_sr = highest_sr;
  processed.fc_rate = 100 / scores.length * total_fc;
  processed.total_length = total_length;
  processed.average_length = total_length / scores.length;

  return processed;
}