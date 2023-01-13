const CHANGETYPES = {
    NEW: 0,
    FIX: 1,
    REMOVE: 2,
    MISC: 3
}

const updates = [
    {
        version: '2.2.0',
        date: 'n/a',
        changes: [
            [CHANGETYPES.NEW, 'Added score-based leaderboards', '260f50e96a20ec2ed9d0f0216aef2b3b54113d35'],
            [CHANGETYPES.NEW, 'Added comments', 'f799cacd1ee3d99137a2c639e829f43d3e9a2fe7'],
            [CHANGETYPES.NEW, 'More user root statistic cards', 'e93192b88fd386d21c278167210cd7d8c212ccd3'],
            [CHANGETYPES.NEW, 'Previous/Next buttons added to daily data', '469076becba17171aea3c0a3283d88793796fbb1'],
            [CHANGETYPES.NEW, 'Added completion page to user', 'f83c9ae6fc48361b7b776fcc1799b1c169795e9c'],
            [CHANGETYPES.MISC, 'Performance improvements', '809c55ad628c96265b04090142da1ec97bd06388'],
            [CHANGETYPES.MISC, 'Loved is now enabled by default, turned off by URL loved parameter', '336831551c4ad8ccb8d3b3e87811e78623a9863c'],
        ]
    },
    {
        version: '2.1.0',
        date: '2023-01-09',
        changes: [
            [CHANGETYPES.NEW, 'Added a new tool: "Command Helper"', '07b1c5205603687df8cd0c3df5d457351c88214c'],
            [CHANGETYPES.NEW, 'Added a new tool: "Missing Beatmaps"', '1d95d6b82258fdd9de66bab644dc6af704758605'],
            [CHANGETYPES.NEW, 'Added a new tool: "Level Calculator"', 'aa349980ec5fa25afe8124060e2d4534d6802544'],
            [CHANGETYPES.NEW, 'Added a new tool: "Score Rank Calculator"', '8251c39ab6744f22456edb5563bbd1ad244a2cc5'],
            [CHANGETYPES.NEW, 'Added servers status to root page', '334e3bde945e4d7b7064f4719202210e6d53fc4c'],
            [CHANGETYPES.NEW, 'Added a visitor stats to root page', 'cfe979effd20b9c0d93db61fa2724e35913c3316'],
            [CHANGETYPES.NEW, 'Added country filter to leaderboards', 'da70a6af7d0d03961c5612c7ad033648f27daab8'],
            [CHANGETYPES.NEW, 'Added total score graphs', '4464d4effb310ebaa5f92bb10ea42646e1fc2046'],
            [CHANGETYPES.FIX, 'Fixed score rank not showing up in user profile', '1708867710510dbd72a98677ec33188958bb7172'],
            [CHANGETYPES.FIX, 'Increase graph point size so users can hover them', '244c549a0b2d790ca2068aebc2b86d9651a2b562'],
        ]
    },
    {
        version: '2.0.0',
        date: '2022-12-30',
        changes: [
            [CHANGETYPES.MISC, 'Complete project overhaul', '068611db9df9e7354ebeba18309878ef47f9d558'],
            [CHANGETYPES.NEW, 'Showing user load status', '73355d5daaa18ac9a74ac2a89464729bc941099b'],
            [CHANGETYPES.NEW, 'Added react.js routing', '407ab9ee68a2b33e04d4c5997a9345351d60363c'],
            [CHANGETYPES.NEW, 'New search modal with improved autocomplete', '068611db9df9e7354ebeba18309878ef47f9d558'],
            [CHANGETYPES.NEW, 'Leaderboards added', '617b1fcb94fd958d1dd16b587ba5db05dfbb57c1'],
            [CHANGETYPES.NEW, 'Top scores added', 'c5eaee4595642b3c82b852587c0e5d32ec836f61'],
            [CHANGETYPES.NEW, 'User profile customization added', 'e96d37141d0b85309d1c978ae7820db309bf7dab'],
            [CHANGETYPES.NEW, 'Logging in through osu! added', '994e1e990bbbc879045eda012c3436dab7f27562'],
            [CHANGETYPES.NEW, 'Special inspector user roles added'],
            [CHANGETYPES.FIX, 'Much faster scores processing'],
            [CHANGETYPES.MISC, 'Rewritten API endpoints to a single server instead of seperated ones (osu, osu!alt were dealt with seperately)'],
        ]
    },
    {
        version: '1.3.1',
        date: '2022-12-02',
        changes: [
            [CHANGETYPES.FIX, 'Redirect to correct tab', '35c1b2c0523668fab313b3fe8facba2a73e4123b']
        ]
    },
    {
        version: '1.3',
        date: '2022-12-02',
        changes: [
            [CHANGETYPES.NEW, 'Added average accuracy to general tab', 'dcb8a3dd93516feb6004b6462d7acf461ed00302'],
            [CHANGETYPES.NEW, 'Added average accuracy to monthly graph', '7e4e0a1dd16ce328754eb46ffd70e2249e92c233'],
            [CHANGETYPES.NEW, 'Added global/country rank to monthly graph', 'c97a96a3d358d828957df66c9502755915ab0afd'],
            [CHANGETYPES.NEW, 'Added raw PP to monthly graph', 'c97a96a3d358d828957df66c9502755915ab0afd'],
            [CHANGETYPES.NEW, 'Added ss score to monthly graph', 'd7cec95e33ffabd73bceeeee8e65aa30d3b6192c'],
            [CHANGETYPES.NEW, 'Added dataset sources info', '2b0c446dc4c8b9ae5fac6d14d48cf8fb9ac102db'],
            [CHANGETYPES.NEW, 'Added beatmap statistics', 'b518519bda8154862b8e493ed09b506a8bb634b6'],
            [CHANGETYPES.NEW, 'Snow mode 🎅', '88086fbf528859a67b0e8acc70bbc7baec809814'],
            [CHANGETYPES.MISC, 'Changed the tags list to a tag cloud', 'a2bb7f31d08a981e07cf9bbd57f5201d7c586517'],
            [CHANGETYPES.MISC, 'Improved monthly graph controls', '7f2e83513a4f6c3f38277aa7282d60ca9d48b153'],
        ]
    },
    {
        version: '1.2',
        date: '2022-11-05',
        changes: [
            [CHANGETYPES.NEW, 'Added auto complete for registered users', 'c59d53fbccd92abeeed56437c6a0d87f04f634c2'],
            [CHANGETYPES.NEW, 'Added top leaderboard stats', '0706abb7e55332b38d16ea57cc115c6513fdc6da'],
            [CHANGETYPES.NEW, 'Added highest rank tooltip', '6130cba91becfc6a7837ecbe8c0278783525cc69'],
            [CHANGETYPES.NEW, 'Added a pink color theme', '7e3a5163297eab0950969d5503e5c4192cd229f6'],
            [CHANGETYPES.NEW, 'Added average score per play to monthly graphs', '0c9d959c0898b4a845667c428337bd9e265bb109'],
            [CHANGETYPES.NEW, 'Added length data to monthly graphs', '426019bdbb77563481891ec55bcd57cb4d504bf2'],
            [CHANGETYPES.NEW, 'Added highest pp play to monthly graphs', '51422152463410b511392bc0e25a6d5862e90851'],
            [CHANGETYPES.NEW, 'Added hit count to monthly graphs', '52de9edd728b0da84399e1bbbe775076f75878ab'],
            [CHANGETYPES.FIX, 'Fixed reprocess warning showing up when no user is processed', 'f218bef7f2906e9e6373eb5ee08568b1eb192a46'],
            [CHANGETYPES.MISC, 'Redid monthly graphs', '7edac3022487594a3235421321116741e8837154'],
        ]
    },
    {
        version: '1.1.2',
        date: '2022-10-08',
        changes: [
            [CHANGETYPES.FIX, 'Added pack_id null check to fix crash', '07829446856a929b2fccbcac36cd3d71d2717a2a'],
            [CHANGETYPES.FIX, 'Fixed missing scores'],
        ]
    },
    {
        version: '1.1.1',
        date: '2022-10-07',
        changes: [
            [CHANGETYPES.FIX, 'Step 4 was numbered incorrectly', '7b3de344fac1ce677abb3190b1a2324684b75755'],
            [CHANGETYPES.FIX, 'Fixed incorrect PP if x% acc', '0baa79c09d90a7a4486477bb89565ffa41ac773d'],
        ]
    },
    {
        version: '1.1.0',
        date: '2022-10-07',
        changes: [
            [CHANGETYPES.NEW, 'Added a new theme', '43a14924e83cf5ddb65ec30f4d9be9bc03257e58'],
            [CHANGETYPES.NEW, 'Fetching is now done through an API instead of requiring a .csv file', '46c0976c731b8b8f7fd24f63dbdb1cf2041acc7d'],
            [CHANGETYPES.MISC, 'Moved the username input to landing page', '71ac695417a55251185500327e8a97641ca9e097'],
        ]
    },
    {
        version: '1.0.3',
        date: '2022-09-17',
        changes: [
            [CHANGETYPES.NEW, 'Added approximate real playtime calculation', '28178946d7a240be48322460b9306b272af4a31a'],
            [CHANGETYPES.NEW, 'Added total pp to monthly graph', '0650c62ee8abbc078d4a903cd947af9207145c98'],
            [CHANGETYPES.FIX, 'Fixed incorrect attribute display values', '858e36bbb4ae19e99db3237b2e96f47eae7187c8'],
            [CHANGETYPES.FIX, 'Fixed incorrect sessions with lone scores', 'f7a4807824f578b61ac4613a55d5674e8c804e94'],
            [CHANGETYPES.FIX, 'Optimized some processing', '77d8c808f2f7afddabed619a38f9f9b3e863ee94'],
            [CHANGETYPES.FIX, 'Better failure feedback (API down for example)', 'f6111badf7c29002a54ec7a87962d7483a46aba1'],
            [CHANGETYPES.FIX, 'Fixed incorrect grade icons', '37514d0e8d965a786a9cba4fbb2a6e236bfa946b'],
            [CHANGETYPES.MISC, `StanR performance balancing`, 'b49bf2c2b7fa8f0e4ed588917758f0cc102be22e'],
            [CHANGETYPES.MISC, 'Star rating updates', 'b49bf2c2b7fa8f0e4ed588917758f0cc102be22e'],
            [CHANGETYPES.MISC, 'Dependencies version bumping'],
        ]
    },
    {
        version: '1.0.2',
        date: '2022-09-17',
        changes: [
            [CHANGETYPES.NEW, 'Added 2016 performance calculator and topplays for it', '06004fa8a6e36633da4f6d8146544515d5a1a1fa'],
            [CHANGETYPES.NEW, 'Added pp difference on \'if\' cards on general', '4e3f7fa1f05aa92686cbed3c8c7577a72ed9b191'],
            [CHANGETYPES.NEW, 'New landing page', '7c6bc20ee434f553c9c111f3758007e6f5c1cb9d'],
            [CHANGETYPES.NEW, 'Beatmap pack completion added', 'e3778c7a9459ec5e8b347514075b5008afbd6669'],
            [CHANGETYPES.FIX, 'Fixed wrong combo on 100% accuracy pp calc on scoreview', 'a9cfb42967c46813f30b53e5f2b6524733eb4645'],
            [CHANGETYPES.FIX, 'Fixed some scores showing outside any activity area', '1b11696749deec3fa26a4f9637fea54f87857204'],
            [CHANGETYPES.FIX, 'Fixed completion cards missing the highest value (AR10, OD10, CS10)', '830aadb7a69cc9c0de1a6a5f2ef480753e5aad53'],
            [CHANGETYPES.FIX, 'Fixed completion cards missing loved data', '830aadb7a69cc9c0de1a6a5f2ef480753e5aad53'],
            [CHANGETYPES.MISC, 'Design overhaul', '4740f58373862be6fe41cca6adae275c143270f0'],
            [CHANGETYPES.MISC, 'Dependencies version bumping', 'c9fd4dedfebcd430d6f584859c52c3b96128d5ac'],
        ]
    },
    {
        version: "1.0.1",
        date: "2022-09-10",
        changes: [
            [CHANGETYPES.NEW, "Added changelog page", '608894cd6bd388054761191fc128982340f1b2cb'],
            [CHANGETYPES.NEW, "Loved maps are now supported", 'f6317ec5f9314172fa75ddc98d8fbad2119a05e0'],
            [CHANGETYPES.NEW, "Score filtering", 'bab623f6cecf22993aba5b1558ace829390f45d2'],
            [CHANGETYPES.NEW, "Added xexxar bonus pp proposal data", '3d4f61041b02dff1d98748544bffc6bd0834e348'],
            [CHANGETYPES.FIX, "Beatmap URL in score view", '08c36bab47561562ff082a62d27e2ed5a122b31e'],
            [CHANGETYPES.FIX, "Date graphs current date was missing", 'dca94923470b6ceb8d1c8df636b3013a3e7e9cb6'],
            [CHANGETYPES.MISC, "Design updates", '4fbbcdfa45611ff2cbb24f53edd8b22560d385b6'],
            [CHANGETYPES.MISC, "Changed font to 'comfortaa'", '4fbbcdfa45611ff2cbb24f53edd8b22560d385b6'],
            [CHANGETYPES.MISC, "Dependency updates", 'cfa8381de91f85e8c07caf47e6c3c3124eb536fb'],
        ]
    },
    {
        version: "1.0.0",
        date: "2022-08-06",
        changes: [
            [CHANGETYPES.MISC, "Untracked changes"],
        ]
    }
];

export { updates, CHANGETYPES };