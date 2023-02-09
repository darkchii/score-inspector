const CHANGETYPES = {
    NEW: 0,
    FIX: 1,
    REMOVE: 2,
    MISC: 3
}

const PLATFORMTYPES = {
    WEB: 0,
    API: 1,
}

const updates = [
    {
        version: '2.4.0',
        date: '2023-02-09',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added user card image generator', 'c83f957f1678c6c45f487ddd46f52a98097729ea'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added highest star rating pass to monthly graphs', '9629338f388fc18814072a593a0ccd542d81d9bd'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added experimental lazer pp', 'a839806a422b75506183ba36ee84a83967cd9684'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added 2014 pp with star ratings from the time', '775f5aa4d93b6e1b2c0dabb4fe17d58be2ded0e3'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added 2016 star rating values (DT is still a bit buggy)', '00162a640da078cc5a072596649eb7f0f768c048'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed PP objects getting assigned incorrectly', 'c6529e7c6cacff978cbbfa8cda575d8c26d56ab2'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed incorrect average length formatting', '2e989879b0084c468ac66c060f9ed407b0a46d72'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed restricted users crashing leaderboards page', 'e11852d0a09d99fe53b774803e17a45b7bfd2d2e'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Added null checks to login data validation', '3ac71c7fcec7b4b1345f3303df32c11cee7eeb74'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed charts axis reversal (global and country rank)', '6e0889eceb8db43ed47ccca1d14be06348cd5f61'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed scoreview incorrect donut chart data', '9f0ccb59dd0900de4c35aaf7fc622fe731572884'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Fixed unique rank leaderboards'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed (hopefully) uBlock failing user fetch (probably 3rd party score rank api call)', '917facde673778a50cd36139c9171207b06bcc1b'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Fixed osu!alt showing up as offline on status check'],
            [PLATFORMTYPES.API, CHANGETYPES.MISC, 'Cached parts of system info that are extremely slow to fetch'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Added simulated data where missing for osudaily (except ranking)', '6e0889eceb8db43ed47ccca1d14be06348cd5f61'],
            [PLATFORMTYPES.API, CHANGETYPES.MISC, 'Converted most server-side database calls to Sequelize usage', 'c9092bbd1146745059025f1e0549aa0471d14714'],
        ]
    },
    {
        version: '2.3.0',
        date: '2023-01-20',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added completion graphs', 'a700d1c3345056810c253f43b9899fe38e4238c6'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added leaderboard: \'Most SSed beatmaps\'', '41c092170d32d512fc4be3349529ff91cc7ba9d0'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added leaderboard: \'Most four-mod SSed beatmaps\'', '41c092170d32d512fc4be3349529ff91cc7ba9d0'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added leaderboard: \'Longest rank time\'', '41c092170d32d512fc4be3349529ff91cc7ba9d0'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added leaderboards: \'Unique SS/FC/DTFC\'', 'f6f3e28928b444e40c681b36f0ba2e70b50d5a99'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added server stats to root page', 'e317add86673cdd121b3331418db901c7af25f43'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Added null check on user object before fetching scores', '7d6b30b7c29f768f93fa6fcfce8be2cfb5d89e25'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed ranked and total score graphs on monthly data', '6b1865d51407f918ecacab7a5363412f00c1b072'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Moved completion data generation to server-side (removes need to download beatmap data)', 'a700d1c3345056810c253f43b9899fe38e4238c6'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Visual user page changes', '37a3e2653ff7ea6cb61e1d620bafbeafad9225d5'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Added several beatmap details to top scores cards', 'e45fb483164d8923ca3a09bab2cb793dea4aeda5'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Added a warning if user is available but isn\'t a \'priority user\' (incomplete data)', 'a81faf37ecd72d3fe0fe69ded3cdcf0c02892883'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'General user page performance improvements', '26dac93d3d9b52576af1a8df3a25387023aa6604'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Snowmode off by default', '7cbdb07c8e83a1a29a77d1030296232170c532ef'],
        ]
    },
    {
        version: '2.2.0',
        date: '2023-01-13',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added score-based leaderboards', '260f50e96a20ec2ed9d0f0216aef2b3b54113d35'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added comments', 'f799cacd1ee3d99137a2c639e829f43d3e9a2fe7'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'More user root statistic cards', 'e93192b88fd386d21c278167210cd7d8c212ccd3'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Previous/Next buttons added to daily data', '469076becba17171aea3c0a3283d88793796fbb1'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added completion page to user', 'f83c9ae6fc48361b7b776fcc1799b1c169795e9c'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Fixed country filter not influencing pagination on leaderboards'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Performance improvements', '809c55ad628c96265b04090142da1ec97bd06388'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Loved is now enabled by default, turned off by URL loved parameter', '336831551c4ad8ccb8d3b3e87811e78623a9863c'],
        ]
    },
    {
        version: '2.1.0',
        date: '2023-01-09',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added a new tool: "Command Helper"', '07b1c5205603687df8cd0c3df5d457351c88214c'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added a new tool: "Missing Beatmaps"', '1d95d6b82258fdd9de66bab644dc6af704758605'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added a new tool: "Level Calculator"', 'aa349980ec5fa25afe8124060e2d4534d6802544'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added a new tool: "Score Rank Calculator"', '8251c39ab6744f22456edb5563bbd1ad244a2cc5'],
            [PLATFORMTYPES.API, CHANGETYPES.NEW, 'Added servers status to root page', '334e3bde945e4d7b7064f4719202210e6d53fc4c'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added a visitor stats to root page', 'cfe979effd20b9c0d93db61fa2724e35913c3316'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added country filter to leaderboards', 'da70a6af7d0d03961c5612c7ad033648f27daab8'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added total score graphs', '4464d4effb310ebaa5f92bb10ea42646e1fc2046'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Fixed score rank not showing up in user profile', '1708867710510dbd72a98677ec33188958bb7172'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Increase graph point size so users can hover them', '244c549a0b2d790ca2068aebc2b86d9651a2b562'],
        ]
    },
    {
        version: '2.0.0',
        date: '2022-12-30',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Complete project overhaul', '068611db9df9e7354ebeba18309878ef47f9d558'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Showing user load status', '73355d5daaa18ac9a74ac2a89464729bc941099b'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added react.js routing', '407ab9ee68a2b33e04d4c5997a9345351d60363c'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'New search modal with improved autocomplete', '068611db9df9e7354ebeba18309878ef47f9d558'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Leaderboards added', '617b1fcb94fd958d1dd16b587ba5db05dfbb57c1'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Top scores added', 'c5eaee4595642b3c82b852587c0e5d32ec836f61'],
            [PLATFORMTYPES.API, CHANGETYPES.NEW, 'User profile customization added', 'e96d37141d0b85309d1c978ae7820db309bf7dab'],
            [PLATFORMTYPES.API, CHANGETYPES.NEW, 'Logging in through osu! added', '994e1e990bbbc879045eda012c3436dab7f27562'],
            [PLATFORMTYPES.API, CHANGETYPES.NEW, 'Special inspector user roles added'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Much faster scores processing'],
            [PLATFORMTYPES.API, CHANGETYPES.MISC, 'Rewritten API endpoints to a single server instead of seperated ones (osu, osu!alt were dealt with seperately)'],
        ]
    },
    {
        version: '1.3.1',
        date: '2022-12-02',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Redirect to correct tab', '35c1b2c0523668fab313b3fe8facba2a73e4123b']
        ]
    },
    {
        version: '1.3',
        date: '2022-12-02',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added average accuracy to general tab', 'dcb8a3dd93516feb6004b6462d7acf461ed00302'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added average accuracy to monthly graph', '7e4e0a1dd16ce328754eb46ffd70e2249e92c233'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added global/country rank to monthly graph', 'c97a96a3d358d828957df66c9502755915ab0afd'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added raw PP to monthly graph', 'c97a96a3d358d828957df66c9502755915ab0afd'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added ss score to monthly graph', 'd7cec95e33ffabd73bceeeee8e65aa30d3b6192c'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added dataset sources info', '2b0c446dc4c8b9ae5fac6d14d48cf8fb9ac102db'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added beatmap statistics', 'b518519bda8154862b8e493ed09b506a8bb634b6'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Snow mode 🎅', '88086fbf528859a67b0e8acc70bbc7baec809814'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Changed the tags list to a tag cloud', 'a2bb7f31d08a981e07cf9bbd57f5201d7c586517'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Improved monthly graph controls', '7f2e83513a4f6c3f38277aa7282d60ca9d48b153'],
        ]
    },
    {
        version: '1.2',
        date: '2022-11-05',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added auto complete for registered users', 'c59d53fbccd92abeeed56437c6a0d87f04f634c2'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added top leaderboard stats', '0706abb7e55332b38d16ea57cc115c6513fdc6da'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added highest rank tooltip', '6130cba91becfc6a7837ecbe8c0278783525cc69'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added a pink color theme', '7e3a5163297eab0950969d5503e5c4192cd229f6'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added average score per play to monthly graphs', '0c9d959c0898b4a845667c428337bd9e265bb109'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added length data to monthly graphs', '426019bdbb77563481891ec55bcd57cb4d504bf2'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added highest pp play to monthly graphs', '51422152463410b511392bc0e25a6d5862e90851'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added hit count to monthly graphs', '52de9edd728b0da84399e1bbbe775076f75878ab'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed reprocess warning showing up when no user is processed', 'f218bef7f2906e9e6373eb5ee08568b1eb192a46'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Redid monthly graphs', '7edac3022487594a3235421321116741e8837154'],
        ]
    },
    {
        version: '1.1.2',
        date: '2022-10-08',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Added pack_id null check to fix crash', '07829446856a929b2fccbcac36cd3d71d2717a2a'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Fixed missing scores'],
        ]
    },
    {
        version: '1.1.1',
        date: '2022-10-07',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Step 4 was numbered incorrectly', '7b3de344fac1ce677abb3190b1a2324684b75755'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed incorrect PP if x% acc', '0baa79c09d90a7a4486477bb89565ffa41ac773d'],
        ]
    },
    {
        version: '1.1.0',
        date: '2022-10-07',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added a new theme', '43a14924e83cf5ddb65ec30f4d9be9bc03257e58'],
            [PLATFORMTYPES.API, CHANGETYPES.NEW, 'Fetching is now done through an API instead of requiring a .csv file', '46c0976c731b8b8f7fd24f63dbdb1cf2041acc7d'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Moved the username input to landing page', '71ac695417a55251185500327e8a97641ca9e097'],
        ]
    },
    {
        version: '1.0.3',
        date: '2022-09-17',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added approximate real playtime calculation', '28178946d7a240be48322460b9306b272af4a31a'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added total pp to monthly graph', '0650c62ee8abbc078d4a903cd947af9207145c98'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed incorrect attribute display values', '858e36bbb4ae19e99db3237b2e96f47eae7187c8'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed incorrect sessions with lone scores', 'f7a4807824f578b61ac4613a55d5674e8c804e94'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Optimized some processing', '77d8c808f2f7afddabed619a38f9f9b3e863ee94'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Better failure feedback (API down for example)', 'f6111badf7c29002a54ec7a87962d7483a46aba1'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed incorrect grade icons', '37514d0e8d965a786a9cba4fbb2a6e236bfa946b'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, `StanR performance balancing`, 'b49bf2c2b7fa8f0e4ed588917758f0cc102be22e'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Star rating updates', 'b49bf2c2b7fa8f0e4ed588917758f0cc102be22e'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Dependencies version bumping'],
        ]
    },
    {
        version: '1.0.2',
        date: '2022-09-17',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added 2016 performance calculator and topplays for it', '06004fa8a6e36633da4f6d8146544515d5a1a1fa'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added pp difference on \'if\' cards on general', '4e3f7fa1f05aa92686cbed3c8c7577a72ed9b191'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'New landing page', '7c6bc20ee434f553c9c111f3758007e6f5c1cb9d'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Beatmap pack completion added', 'e3778c7a9459ec5e8b347514075b5008afbd6669'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed wrong combo on 100% accuracy pp calc on scoreview', 'a9cfb42967c46813f30b53e5f2b6524733eb4645'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed some scores showing outside any activity area', '1b11696749deec3fa26a4f9637fea54f87857204'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed completion cards missing the highest value (AR10, OD10, CS10)', '830aadb7a69cc9c0de1a6a5f2ef480753e5aad53'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed completion cards missing loved data', '830aadb7a69cc9c0de1a6a5f2ef480753e5aad53'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Design overhaul', '4740f58373862be6fe41cca6adae275c143270f0'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Dependencies version bumping', 'c9fd4dedfebcd430d6f584859c52c3b96128d5ac'],
        ]
    },
    {
        version: "1.0.1",
        date: "2022-09-10",
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, "Added changelog page", '608894cd6bd388054761191fc128982340f1b2cb'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, "Loved maps are now supported", 'f6317ec5f9314172fa75ddc98d8fbad2119a05e0'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, "Score filtering", 'bab623f6cecf22993aba5b1558ace829390f45d2'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, "Added xexxar bonus pp proposal data", '3d4f61041b02dff1d98748544bffc6bd0834e348'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, "Beatmap URL in score view", '08c36bab47561562ff082a62d27e2ed5a122b31e'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, "Date graphs current date was missing", 'dca94923470b6ceb8d1c8df636b3013a3e7e9cb6'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, "Design updates", '4fbbcdfa45611ff2cbb24f53edd8b22560d385b6'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, "Changed font to 'comfortaa'", '4fbbcdfa45611ff2cbb24f53edd8b22560d385b6'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, "Dependency updates", 'cfa8381de91f85e8c07caf47e6c3c3124eb536fb'],
        ]
    },
    {
        version: "1.0.0",
        date: "2022-08-06",
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, "Untracked changes"],
        ]
    }
];

export { updates, CHANGETYPES, PLATFORMTYPES };