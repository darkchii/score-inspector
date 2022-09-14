import { Box, Button, ButtonGroup, Card, CardContent, Chip, Grid, LinearProgress, Typography } from "@mui/material";

const completionTypes = [
    { name: 'Difficulty', internalName: 'diff' },
    { name: 'Full Set', internalName: 'fullSet' },
]

function PagePacks(props) {
    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant='h5'>Beatmap pack completion</Typography>
                    <ButtonGroup>
                        {completionTypes.map((completionType) => (
                            <Button>{completionType.name}</Button>
                        ))}
                    </ButtonGroup>

                    <Box>
                        <Grid container>
                            {
                                props.data.processed.beatmap_packs !== undefined ? <>
                                    {props.data.processed.beatmap_packs.map((pack) => (
                                        <Grid item xs={0.5}>
                                            <Chip label={pack} />
                                            <LinearProgress />
                                        </Grid>
                                    ))}
                                </> : <></>
                            }
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </>
    );
}
export default PagePacks;