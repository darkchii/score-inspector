import { Box, Chip, Divider, Grid, List, ListItem, ListItemText, Paper, Stack, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import doc from "../Data/Documentation";
import { green } from "@mui/material/colors";

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        listStyle: 'none',
        padding: 0,
    },
    listItem: {
        position: 'relative',
        paddingLeft: '20px', // Adjust the distance of the vertical line from the left edge
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '2px', // Width of the vertical line
            height: '100%',
            backgroundColor: '#0074d9', // Change the color as needed
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '0',
            width: '10px', // Width of the horizontal line
            height: '2px', // Height of the horizontal line
            backgroundColor: '#0074d9', // Change the color as needed
            transform: 'translateY(-50%)',
        },
        '&:first-child::before': {
            height: '50%', // Adjust the height for the first item
            transform: 'translateY(100%)', // Move the vertical line to the bottom of the first item
        },
        '&:last-child::before': {
            height: '50%', // Adjust the height for the last item
        },
    },
}));

function Docs() {
    const classes = useStyles();

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <Grid>
                <Typography variant="h4">{doc.title}</Typography>
                <Typography variant="body1">Base API url: {doc.base_url}</Typography>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={4} sx={{
                    height: 'calc(70vh)',
                    maxHeight: 'calc(70vh)',
                    overflowY: 'auto',
                }}>
                    <Paper elevation={3} sx={{ height: '100%' }}>
                        <List>
                            {/* <ListItem button onClick={() => scrollToSection('section1')}>
                                <ListItemText primary="Section 1" />
                            </ListItem>
                            <ListItem button onClick={() => scrollToSection('section2')}>
                                <ListItemText primary="Section 2" />
                            </ListItem>
                            <ListItem button onClick={() => scrollToSection('section3')}>
                                <ListItemText primary="Section 3" />
                            </ListItem> */}
                            {
                                doc.paths.map((path, index) => {
                                    return (
                                        <ListItem key={index} button onClick={() => scrollToSection(`section${index}`)}>
                                            <ListItemText primary={path.path} />
                                        </ListItem>
                                    )
                                })
                            }
                            {/* Add more list items for additional sections */}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={8} sx={{
                    maxHeight: 'calc(70vh)',
                    overflowY: 'auto',
                }}>
                    <Box sx={{
                        p: 8
                    }}>
                        {
                            doc.paths.map((path, index) => {
                                return (
                                    <Grid id={`section${index}`}>
                                        <Typography variant="h6"><Chip label={path.type} size='small' /> {path.path}</Typography>
                                        <Typography variant="body1">{path.description}</Typography>
                                        <Typography variant="body1">Params:</Typography>
                                        <List className={classes.root}>
                                            {
                                                path.params.map((param, index) => {
                                                    return (
                                                        <ListItem className={classes.listItem}>
                                                            <Stack direction="column" sx={{width: '100%'}}>
                                                                <Stack direction="row" spacing={1}>
                                                                    <Typography variant="body1">{param.name}</Typography>
                                                                    {
                                                                        param.required && <Typography sx={{ fontSize: '0.7rem', color: green[500] }}>required</Typography>
                                                                    }
                                                                </Stack>
                                                                <Typography sx={{ fontSize: '0.7rem' }}>{param.description}</Typography>
                                                                {
                                                                    param.example && <Typography sx={{ fontSize: '0.7rem' }}>Example: {param.example}</Typography>
                                                                }
                                                                {
                                                                    index < path.params.length - 1 && <Divider sx={{mt: 2}}/>
                                                                }
                                                            </Stack>
                                                        </ListItem>
                                                    )
                                                })
                                            }
                                        </List>
                                        {/* <ul>
                                        </ul> */}
                                        {
                                            index < doc.paths.length - 1 && <Divider sx={{ mb: 2, mt: 2 }} />
                                        }
                                    </Grid>
                                )
                            })
                        }
                    </Box>
                </Grid>
            </Grid >
        </>
    )
}


export default Docs;