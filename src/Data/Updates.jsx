/* eslint-disable react-refresh/only-export-components */
const CHANGETYPES = {
    NEW: 0,
    FIX: 1,
    REMOVE: 2,
    MISC: 3
}

const PLATFORMTYPES = {
    WEB: 1,
    API: 2,
}

const updates = [
    {
        version: '3.4.0',
        date: '2025-03-06',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Updated performance and star ratings calculator', '46f2d5d4a346bd8a320814f577927f158cfe46aa'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added active players graph to where clans image used to be', '7d4796c1bc37089689bbf2337a77502199ac2cb4'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'User completion tab data is now made client-side', '46f2d5d4a346bd8a320814f577927f158cfe46aa'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'ScoreView difficulty name label now links to the osu! website beatmap', '47df13beb6eab7128d931d35174285feb4d51f30'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fix AR calculation using wrong function to get DA mod setting', 'd0afb2ae315ce22f800a63ca6a05a546223984b3'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed OD calculation', 'bc5d7ce875eb4fd28b6d8d70adc8239c6a2be2af'],
            [PLATFORMTYPES.WEB, CHANGETYPES.REMOVE, 'Removed completed packs toggle', '6b5d0f75891978eb49ec03e644c98dafe30a028b'],
        ]
    },
    {
        version: '3.3.1',
        date: '2025-01-23',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added rate change spread to profiles', 'c4163a5f873e08dd0bc2e68b74e5f5457561137d'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added detailed graphs section to profile', '49129ab9d09777b57265ce2928b28a92bf04c33f'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added session and session length graphs', 'cf6584d313b52f866ad541c75eae1fb18fddcb80'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Remove requirement of legacy modded star rating'],
        ]
    },
    {
        version: '3.3.0',
        date: '2024-12-22',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, '🎄 osu!wrapped 2024', 'c260d917b1d0a9bb2ff8100bf3f0a6ae686b72a2'],
            [PLATFORMTYPES.WEB | PLATFORMTYPES.API, CHANGETYPES.NEW, 'Lazer mods, star ratings now supported (request refetch to update all old scores)', 'c260d917b1d0a9bb2ff8100bf3f0a6ae686b72a2'],
            [PLATFORMTYPES.WEB | PLATFORMTYPES.API, CHANGETYPES.MISC, 'Performance calculator updated to Combo Scaling Removal', '1c4c351171fe4aa520a5d38bd6012b4797c59b4c'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added private and completion mode settings to profile to hide entire or parts of profile', 'd2c3d1d78aaf388278bbf15096c31bc8777b736d'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Highlighting completed and fully full-combo\'d beatmap packs', '373861c26653282d029157ae1dec917daeb9c9a7'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added longest approval times beatmap leaderboard', '5ed4aa9460cffdfbfb3aefdf1f599c28fae356e4'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Design overhauls'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added median graphs to user profiles', 'd60c72d73b660b3d50e5b6e1cea02f3be493b7be'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added clan share URL which can embed in places like Discord', '19cd2df76dca4a7ee5cdebb282aa7ed12b7a8911'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added clan moderators', '8887538fb108c11d2ba0b22781a162782d0637d9'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added clan background images', '3bd70a1bbd637b01f06b6943c897094eb88ac256'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added proposed XP 2.0 to clans', 'e39a8dab18cdddb22fb66839d6eb0d14dffe0a11'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Lazer score calculator more accurate', '9837c2c228e5a78de8f9c2443033c7dfe8ace5ef'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Added missing member kick log formatter', 'a4c70f63e696e3b84a0239ccc07aaf58d931c181'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed periodic farmers log scroll', 'd570fa04f013179660350072a12a0fd1ccff7cb4'],
            [PLATFORMTYPES.WEB, CHANGETYPES.REMOVE, 'Removed peak farm days from profile', '78ae143a19f72a31d07f958586ffb20546494a9e'],
            [PLATFORMTYPES.WEB, CHANGETYPES.REMOVE, 'Removed player comparison page', '88ed545c47adba0c5217246d34240efded7d442c'],
            [PLATFORMTYPES.WEB, CHANGETYPES.REMOVE, 'Removed osu!daily data and fetch', 'a0def38b6c836438e01c45ac2daf995bc3c43e5f'],
            [PLATFORMTYPES.WEB, CHANGETYPES.REMOVE, 'Removed Bancho chat data', '618dbfe96eb2a4cbeffc19727f656fcfa271c404'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Migrated the entire front-end to Vite', '21756d06065c3b5786304d3c3ac0ddd0357407d5'],
        ]
    },
    {
        version: '3.2.0',
        date: '2024-09-10',
        changes: [
            [PLATFORMTYPES.API | PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Clan ownership transferring added', '6bb6b12d99967be7171cfafc22569a489e2e7189'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Clan logs added', '09238889133d58ddd279313d70dd0b5f5516c224'],
            [PLATFORMTYPES.API | PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Monthly clan rankings added', 'b7ea0f591633c50562371e7fa26878378f6a6c33'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Clan listing and page (slight) redesign', 'a21275e2a7d724eb745008df76574a3bde0f0b1c'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Changed to local flag images', '6cc55e42c12f38380d415715359f818eb81e3cb8'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Changed population page TopoJSON dataset to correct some borders for world map', 'c5b357723ea67ea51e7b4156c38a19d81d3edf1d'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Global periodic top plays page now contain much more information in the card', '49d154942daf6020f85923c021ed8adfd065bd70'],
            [PLATFORMTYPES.WEB | PLATFORMTYPES.API, CHANGETYPES.MISC, 'Global periodic top plays are now based on 0 utc for that day/week/etc instead of last x days', '3276840f8371eb21d840dc53ec61d570de0d07de'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Small website-wide changes', '49d154942daf6020f85923c021ed8adfd065bd70'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Monthly farmers is being updated again'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added public bancho chats statistics', 'd382d5d08f87ae8a8ca70e20956a9ebc3b3144ba'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Major update to MUI v6, moved away from deprecated components', '0436f11f76af17094323461c7aecb5a253bfcbe1'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Clan owners can now set default sorting for their clan page', '1347b519029b667f2451966b13725ebd8133c825'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Profile covers now show up correctly on clan member listing', '3e3e74148b3a0c61f004f209fd6a9a61f4786478'],
        ]
    },
    {
        version: '3.1.0',
        date: '2024-07-16',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'User profile clan tags link to tag now', 'e087d504c0b3624a12e868ad984e116d2f278b44'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Added pagination and search to clans listing', '698160b9551364a7aebd9f9da8cfb7cbcda632aa'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed SS and S ranking on clans page', '72d13dc70304f46f43bd87c5485bafe411227ce5'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added sessions user tab', '3a7f571b6a83f1a02d9af3475b080402a707e453'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Added color picker to clan editor form', '7833f16aefb7b7ae3490800df13a539c1280f87e'],
        ]
    },
    {
        version: '3.0.2',
        date: '2024-06-15',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.REMOVE, 'Removed poll, small web adjustments', 'c70220c6f2a6dc828b8544b47475ce24de07f333'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added 5-minute breaks display to user daily graph', '538ed5d04bc2759b9da1dd2455ee70bf411f99f0'],
            [PLATFORMTYPES.API, CHANGETYPES.MISC, 'Temporarily disabled monthly farmers updater', 'c70220c6f2a6dc828b8544b47475ce24de07f333'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed year buttons on daily graph not working', 'ab17be093d87d4a595fb589a72625f9bcdc08fdc'],
        ]
    },
    {
        version: '3.0.1',
        date: '2024-06-11',
        changes: [
            [PLATFORMTYPES.WEB | PLATFORMTYPES.API, CHANGETYPES.FIX, 'Fixed timezone issues for user profiles', '8e4d5ef9b5af6a69a6b7ad0f0c7db23f63159966'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed clan tags showing on pending users', 'cb89f7787becc3c55211347f537db68b3d299959'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed country flags not showing in some browsers', '03956ae3aa4d45d7cacfbd2059300cc956734a1c'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Added search bar autofocus when opening modal and after search', 'c813cd4eb2d96ea443563313054af43790b22c5e'],
            [PLATFORMTYPES.API, CHANGETYPES.MISC, 'Added stricter string input validation to clans'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Fixed completion leaderboard not including loved beatmaps in calculation'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Fixed some authentication issues'],
        ]
    },
    {
        version: '3.0.0',
        date: '2024-05-27',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added clans', '00ca1dffcdf0d379c74b35d4e342acccb5802cc1'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added completionists page', 'b413ebbf809b63d16642938b3560c2298bcafab5'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added global scores browser', '9efab4544402065237ebe3787ee4057f010cab16'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added daily poll of 5 random beatmaps', '73ce2bb8cdc1c5eeb6c090b23d5aaa136f8b8912'],
            [PLATFORMTYPES.WEB | PLATFORMTYPES.API, CHANGETYPES.NEW, 'Added more monthly farm statistic types', '9dc6361e8ccad52ee82e3de4e73c274a671bad4a'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'User page tabs now have a dedicated URL section, allowing direct linking and refreshing', 'd44491eb0119b2fcb9f264b5ce8e22027f0b07db'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Missing modded star ratings will now get value 0, to keep showing the scores', 'b4f0092eed016c68c40f633b102256900ad0459e'],
            [PLATFORMTYPES.WEB | PLATFORMTYPES.API, CHANGETYPES.FIX, 'Index statistics load much faster now', '420f661bac62804109f76dc85374346cc3aa7ad0'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Updated bonus pp formula', '73ce2bb8cdc1c5eeb6c090b23d5aaa136f8b8912'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Top 10k score gain graph added', '92b0e290401020e12ef1a712646d0cde7d068e05'],
        ]
    },
    {
        version: '2.7.3',
        date: '2024-02-25',
        changes: [
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Temporarily fixed top scores page to ignore modded star rating if not in database'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Added lazer disclaimer alert on index page'],
        ]
    },
    {
        version: '2.7.2',
        date: '2024-01-15',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed month name localization on month top players', '911db114312c578a9e8b6a9b2abacd6c9c3eb93e'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed player cards not centered on tooltips', 'ae9ad3a86076930537e2788fafd977d5a459d11c'],
            [PLATFORMTYPES.API | PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added top month overtakes logging', '1d9e42c08fd0cf7e1aafd75f4a5de01065a374d1'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Added extra info in case user has no users2 entry yet in osu alt database', 'c99d3b331f9cfb18cebe8f3ea16d4fcaeee99526'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed font sizes on score history leaderboards', 'e335dd38333ab8f9fecf67fb288c9ba0f98d93a3'],
            [PLATFORMTYPES.API, CHANGETYPES.MISC, 'Country/population stats are now cached'],
        ]
    },
    {
        version: '2.7.1',
        date: '2024-01-09',
        changes: [
            [PLATFORMTYPES.WEB | PLATFORMTYPES.API, CHANGETYPES.NEW, 'Added top scorer for ranked/loved beatmaps per month', 'd99d2864e8abf0801f3e917216d6127641da3e15'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed level text displayed incorrectly', 'ead31793dd04544cbc053a21e1830ca81b9613e9'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Fixed unable to first-time login']
        ]
    },
    {
        version: '2.7.0',
        date: '2024-01-01',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added milestone tracking and page', '12831f8e222d92503e4ddd33bed5176bbfcbcdd1'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added score rank history tracking', '101e3581715041165ad1593a9dee33f7e51b6389'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added performance distribution table to stats', '376711a056c5eedea745b2dc6db87f1d2c9531b8'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added osu!alt Discord server widget to landing', 'a7345873e987b4f08e742dd5202ea731135743b0'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Missing beatmaps tool now supports all modes', 'd1dd30f8287d74c451c82229dba325711512e3ce'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added country based statistics', '09e40bf12281deb6b679d9566fd3ea9c701cf4fd'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Opt-in public friends page added to user', '391562f695e063bd1a9ef893df800dc391bfd2fd'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added socials to user page header (based on osu profile)', '1e5018d535c5bbfcad78a8c693350c2f4f84b106'],
            [PLATFORMTYPES.API, CHANGETYPES.NEW, 'Added public API', '0cb4da65cd37fb1cfa5864a93cbf4c1de66507c7'],
            [PLATFORMTYPES.API, CHANGETYPES.NEW, 'Added PP record timeline', 'e813de707e2a5a8a43afb50b90c3941898c76869'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added "today" farmers leaderboards on landing', 'b5eb6cecbebd8f0a8a6d79c9fe7439b8bef048e2'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added lazer standardized scoring to leaderboards', '70142338a956c892b8f8e01b756952be66172051'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added lazer classic scoring to leaderboards', '51cd92168e4b59fefc99b07bfcda7f845621a0dd'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Updated most charts to use ApexCharts for better performance', 'de3423353b254d2809cfae3a02f80c030f441571'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'All routes have custom titles now', '1b247bbf1952464acaec532df933e8449e8fe027'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Improved medals user page section', '5d3370f4d21e9c028a76bb722dc2fb95b7ab13b5'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'New medals added'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Landing page container widths adjusted', '80fc790df4edf59233aa0edd216bcc7c105ba2d2'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Better role system', '58c85b1f57bab6162a0e7c4557bbf7ede4ec13a9'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Better mobile support', '9fff5c3259ddf19d778203fc2b2f5b23c1d7818a'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Website moved to score.kirino.sh', 'cc6641698fef53dbb1e2e76e0f296f4f99744acc'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Removed website settings modal', 'a5c9e659e407b1f1b0e202ce7a9822b03be43e95'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Rewritten user graphs page', '5063993ddfd1edb85c135a79e0f814e8c03d3479'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Rank 10000 itself can now be checked in score rank tool', '6aaa6e5254b2b4f3c91dcbcc5ba5d31af3f6b4d7'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Completion data is now only loaded when tab is opened', '0b822a37da27ab1a76db2db1dc9df5654ac592ab'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Added load spinners to slow loading components', '2ea69769903a4c5ba5dec7e4ac4e71a399e224f3'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Inspector database using correct Amsterdam timezone now'],
            [PLATFORMTYPES.WEB | PLATFORMTYPES.API, CHANGETYPES.REMOVE, 'Removed all historical pp and sr calculators due to complexity and performance issues'],
            [PLATFORMTYPES.WEB | PLATFORMTYPES.API, CHANGETYPES.FIX, 'Moved repositories to own git server', '5442f08020b57b74bd6014e735050b49e8619a95'],
        ]
    },
    {
        version: '2.6.0',
        date: '2023-05-23',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Leaderboard username are now Inspector user chips', 'f5b317f4e73a816e9938b95d572081003fa3f041'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'User search modal design overhaul', '03646898d45c95bc03aeac33fe595888fd57a7b0'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Removed compact card section', '766eaf95b10634e4e53195396e456693ec7d9491'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added beatmap pack completion page', 'c96c190db22fe9a8366c38fbfca7e0257d5bdbf2'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added beatmap leaderboards to scoreview', '6dfcf01c07a3e2eae82b47dd66d5b6b8f99019a2'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added visited users list for logged in user', '59eb47877587e1daa6a9058816d424f893f8119b'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added ppv1 to profile', '1b64b0adcb02bd1d6ff044c0026d632c754659cb'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added ppv1 leaderboard', '13058078af8f9c424af0065d22465812cd3e6651'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added beatmap set difficulty count leaderboard', '13058078af8f9c424af0065d22465812cd3e6651'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added medals listing page to user', '9bd26a2dfc5dc5a3e7e51a3406b22cf84f563ce6'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Reworked date picker for daily data', '2793facc7929a8608f17bfa2b24dc068e8f331d6'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed chart height on completion page', '934512f257c1b181378e4aaba32e84c8b344e04b'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed date picker display on daily page', 'df1261f77c06aa27ed287447b185bd6f5822b41e'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Fixed user search not showing non-priority users'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Optimized GetBestScores'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Fixed api not fetching user if osudaily doesn\'t respond'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Fixed api crash caused by incorrect fetching full user profile (username vs id)'],
        ]
    },
    {
        version: '2.5.0',
        date: '2023-04-20',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Page container is now wider', '68541793cd472ba48c3de2aa04e0d4159144a9ba'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Score submissions graph on index page', 'c9c9f0b133b2e17fa8751c8ab145b2a5928b925c'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added button list to changelog to quickly jump to a specific version', '05079062c31ba2f298cea62f4bb6221e211160b6'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added oldest play to list of significant scores', '2579314602369fef96c5da3defa3c37b3a776816'],
            [PLATFORMTYPES.WEB, CHANGETYPES.NEW, 'Added stats page with general data about the entire scores database', 'c39c0374d17edf0d4d3ed6265a6561845e0bfacb'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Removed deprecated top leaderboard positions data', '8bfce404d800fba196c36a9394d2f8783b49ebe6'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Changed score load percentage to downloaded size', '2683f60bf7f0c24995a0bf618ad1aaef54f6d8b4'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed user page background not resetting', '356e3ad2f28a3c18b696681c2b67e2edd85d1039'],
            [PLATFORMTYPES.API, CHANGETYPES.FIX, 'Fixed API server crash when adding new visitor row to database'],
            [PLATFORMTYPES.API, CHANGETYPES.MISC, 'Enabled HTTP compression on all endpoints'],
        ]
    },
    {
        version: '2.4.2',
        date: '2023-02-14',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed missing osu!daily data causing crash', 'b364e3031042aaa16454d7d047dae63e4d80534e'],
        ]
    },
    {
        version: '2.4.1',
        date: '2023-02-12',
        changes: [
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed missing properties when opening PP if FC/SS', 'faadce89f48e26a1ca072eb85758aa36eb0e6165'],
            [PLATFORMTYPES.WEB, CHANGETYPES.FIX, 'Fixed user scores page crash', '201df4345703825a33b632051ec050428eb7a9c3'],
            [PLATFORMTYPES.WEB, CHANGETYPES.MISC, 'Massive performance boost to "pp if ..." modals with virtualization', '825823251b976460a1f233a8e23f33d7aeb3824b'],
        ]
    },
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