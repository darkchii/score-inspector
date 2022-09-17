import { Card, CardContent, Chip, Grid, Link, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { CHANGETYPES, updates } from "../updates";

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