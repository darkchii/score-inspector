import { CssBaseline, Box, AppBar, Toolbar, Typography, Button, Paper, Grid, CircularProgress, Tabs, Tab, Tooltip, Stepper, Step, StepLabel, CardContent, Card } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import './App.css';
import Papa from "papaparse";
import './Tabs.js';
import TabPanel from './Tabs.js';
import PagePerDay from './Tabs/PagePerDate';
import PageGeneral from './Tabs/PageGeneral';
import { calculatePPifFC, calculatePPifSS, getModString, mods } from './helper';
import PageScores from './Tabs/PageScores';
import axios from 'axios';
import { getBeatmapCount, getBonusPerformance, getPerformance, getUser } from './osu';
import Footer from './Components/Footer';
import FileSelector from './Components/FileSelector';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C8598A',
    },
    background: {
      default: "#2A2226",
      dark: '#fff',
      paper: "#382E32"
    }
    // secondary: {
    //   main: '#edf2ff',
    // },
  },
  shape: {
    borderRadius: 8
  }
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

  const [tabValue, setTabValue] = React.useState(1);

  const tabHandleChange = (event, newValue) => {
    setTabValue(newValue);
    console.log(newValue);
  };

  const processData = async (scores) => {
    let _user;

    try {
      _user = await getUser(scores[0].user_id);
    } catch (err) {
      alert(err);
      setLoadState(false);
      return;
    }

    setUser(_user);

    var processed = {};

    let bmCount = null;
    try {
      bmCount = await getBeatmapCount();
    } catch (err) {
      alert(`Unable to get beatmap information right now`);
      setLoadState(false);
      return;
    }

    processed.beatmapInfo = {};
    processed.beatmapInfo.monthly = [];

    bmCount.data.forEach(monthData => {
      const y = monthData.year;
      const m = monthData.month;
      const c = monthData.amount;
      processed.beatmapInfo.monthly[`${y}-${m}-01`] = monthData;
    })

    var bm_maps = 0;
    var bm_score = 0;
    var bm_length = 0;
    processed.beatmapInfo.monthlyCumulative = [];
    Object.keys(processed.beatmapInfo.monthly).forEach(key => {
      const o = JSON.parse(JSON.stringify(processed.beatmapInfo.monthly[key]));
      o.amount = bm_maps += o.amount;
      o.score = bm_score += o.score;
      o.length = bm_length += o.length;
      processed.beatmapInfo.monthlyCumulative[key] = o;
    });

    processed = await CalculateData(processed, scores, _user);
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
        if (testScores(results.data)) {
          results.data = results.data.filter(score => parseInt(score.approved) < 4);

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
            score.star_rating = parseFloat(score.star_rating);
            score.aim_diff = parseFloat(score.aim_diff);
            score.speed_diff = parseFloat(score.speed_diff);
            score.fl_diff = parseFloat(score.fl_diff);
            score.slider_factor = parseFloat(score.slider_factor);
            score.modded_od = parseFloat(score.modded_od);
            score.modded_ar = parseFloat(score.modded_ar);
            score.modded_cs = parseFloat(score.modded_cs);
            score.modded_hp = parseFloat(score.modded_hp);
            score.sliders = parseInt(score.sliders);
            score.circles = parseInt(score.circles);
            score.spinners = parseInt(score.spinners);

            score.totalhits = score.count300 + score.count100 + score.count50 + score.countmiss;

            //perform these at the latest point of parsing
            score.pp_fc = getPerformance({ count300: score.count300 + score.countmiss, count100: score.count100, count50: score.count50, countmiss: 0, combo: score.maxcombo, score: score });
            score.pp_ss = getPerformance({ count300: score.count300 + score.countmiss + score.count100 + score.count50, count100: 0, count50: 0, countmiss: 0, combo: score.maxcombo, score: score });
          });
          // const testID = Math.floor(Math.random() * (5000 - 100 + 1) + 100);
          // const testPP = results.data.find(score=>score.star_rating>8);
          // testPP.pp_ss = getPerformance({ count300: testPP.count300 + testPP.countmiss + testPP.count100 + testPP.count50, count100: 0, count50: 0, countmiss: 0, combo: testPP.maxcombo, score: testPP });
          // testPP.pp_ss = getPerformance()
          // console.log(testPP);
          // results.data[testID].pp_fc = getPerformance({ count300: results.data[testID].count300 + results.data[testID].countmiss, count100: results.data[testID].count100, count50: results.data[testID].count50, countmiss: 0, combo: results.data[testID].maxcombo, score: results.data[testID] });
          //results.data[testID].pp_ss = getPerformance({ count300: results.data[testID].count300 + results.data[testID].countmiss+results.data[testID].count50+results.data[testID].count100, count100: 0, count50: 0, countmiss: 0, combo: results.data[testID].maxcombo, score: results.data[testID] });
          setScoreData(results.data);
          Promise.resolve(processData(results.data));
        } else {
          // console.log("Invalid score dataset!!!!!");
          setLoadState(false);
        }
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
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider', minHeight: '100%', width: '10rem' }}
        >
          <Toolbar />
          <Tab label="General" {...a11yProps(0)} />
          <Tab label="Scores" {...a11yProps(1)} />
          <Tab label="Per Day" {...a11yProps(2)} />
          <Tooltip>
            <Tab label="Per Month" {...a11yProps(3)} />
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
              <FileSelector sx={{ width: '60%' }} handleScoresUpload={handleScoresUpload} loadState={loadState}/>
            </Grid>
            {loadState ? <>
              <br />
              <Grid container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{pb:1}}>
                <CircularProgress />
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
                <PagePerDay data={{ scores: scoreData, user: user, processed: processedData, format: 'day' }} />
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <br />
                <PagePerDay data={{ scores: scoreData, user: user, processed: processedData, format: 'month' }} />
              </TabPanel>
            </> : <></>}
            <Footer sx={{px:3,my:1}} />
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

async function CalculateData(processed, scores, _user) {
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

  processed = calculatePPdata(processed, scores);

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

    if (!(score.enabled_mods & mods.NF) && score.star_rating > highest_sr) {
      highest_sr = score.star_rating;
    }
  }

  used_mods.sort((a, b) => {
    if (a.value > b.value) { return -1; }
    if (a.value < b.value) { return 1; }
    return 0;
  })

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

function calculatePPdata(processed, scores) {
  scores.sort((a, b) => {
    if (a.pp > b.pp) { return -1; }
    if (a.pp < b.pp) { return 1; }
    return 0;
  });

  var index = 0;
  scores.forEach(score => { score.pp_weight = Math.pow(0.95, index); index++; });

  scores = calculatePPifFC(scores);
  scores = calculatePPifSS(scores);

  processed.fc_pp_weighted = 0;
  processed.ss_pp_weighted = 0;
  scores.forEach(score => {
    processed.fc_pp_weighted += score.pp_fc.total * score.pp_fc.weight;
    processed.ss_pp_weighted += score.pp_ss.total * score.pp_ss.weight;
  });
  const bonus = getBonusPerformance(scores.length);
  processed.fc_pp_weighted += bonus;
  processed.ss_pp_weighted += bonus;

  return processed;
}