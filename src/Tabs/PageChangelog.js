import { Card, CardContent, Chip, Grid, Link, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

const CHANGETYPES = {
    NEW: 0,
    FIX: 1,
    REMOVE: 2,
    MISC: 3
}

const updates = [
    {
        version: '1.0.2',
        date: 'n/a',
        changes: [
            [CHANGETYPES.NEW, 'Added 2016 performance calculator and topplays for it', '06004fa8a6e36633da4f6d8146544515d5a1a1fa'],
            [CHANGETYPES.NEW, 'Added pp difference on \'if\' cards on general', '4e3f7fa1f05aa92686cbed3c8c7577a72ed9b191'],
            [CHANGETYPES.FIX, 'Fixed wrong combo on 100% accuracy pp calc on scoreview'],
            [CHANGETYPES.FIX, 'Fixed some scores showing outside any activity area', '1b11696749deec3fa26a4f9637fea54f87857204'],
            [CHANGETYPES.FIX, 'Fixed completion cards missing the highest value (AR10, OD10, CS10)'],
            [CHANGETYPES.MISC, 'Now able to select a start and end day for the daily graph', '53c3730debc4231d1080d51a60669bb0a03d7bc7'],
            [CHANGETYPES.MISC, 'Design overhaul', '4740f58373862be6fe41cca6adae275c143270f0'],
            [CHANGETYPES.MISC, 'Dependencies version bumping'],
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

function PageChangelog(props) {
    return (
        <>
            <Card>
                <CardContent>
                    {
                        updates.map((update, index) => {
                            return (
                                <>
                                    <h1>{update.version}</h1>
                                    <h2>{update.date}</h2>
                                    <List dense>
                                        {
                                            update.changes.map((change, index) => {
                                                let _typeText = '';
                                                let _typeColor = 'primary';
                                                switch (change[0]) {
                                                    case CHANGETYPES.NEW:
                                                        _typeText = 'New';
                                                        _typeColor = 'success';
                                                        break;
                                                    case CHANGETYPES.FIX:
                                                        _typeText = 'Fix';
                                                        _typeColor = 'secondary';
                                                        break;
                                                    case CHANGETYPES.REMOVE:
                                                        _typeText = 'Remove';
                                                        _typeColor = 'error';
                                                        break;
                                                    default:
                                                    case CHANGETYPES.MISC:
                                                        _typeText = 'Misc';
                                                        _typeColor = 'primary';
                                                        break;
                                                }
                                                return (
                                                    <ListItem>
                                                        <Grid container>
                                                            <Grid item xs={0.75} md={0.75}>
                                                                <Chip color={_typeColor} size="small" label={_typeText} />
                                                            </Grid>
                                                            <Grid item xs={1} md={1}>
                                                                {
                                                                    change[2] ?
                                                                        <><Link target='_blank' href={`https://github.com/darkchii/score-inspector/commit/${change[2]}`}><Chip size="small" label={change[2].substr(0, 7)} /></Link> </>
                                                                        : <></>
                                                                }
                                                            </Grid>
                                                            <Grid item xs={10.25} md={10.25}>
                                                                {change[1]}
                                                            </Grid>
                                                        </Grid>
                                                        {/* <ListItemIcon>
                                                            <Chip color={_typeColor} size="small" label={_typeText} />
                                                        </ListItemIcon>
                                                        <ListItemIcon>
                                                            {
                                                                change[2] ?
                                                                    <><Link target='_blank' href={`https://github.com/darkchii/score-inspector/commit/${change[2]}`}><Chip size="small" label={change[2].substr(0,7)} /></Link> </>
                                                                    : <></>
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText>
                                                            {change[1]}
                                                        </ListItemText> */}
                                                    </ListItem>
                                                );
                                            })
                                        }
                                    </List>
                                </>
                            );
                        })
                    }
                </CardContent>
            </Card>
        </>
    );
}
export default PageChangelog;