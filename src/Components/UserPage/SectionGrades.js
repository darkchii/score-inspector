import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { getGradeIcon } from "../../Helpers/Assets";

function SectionGrades(props) {
    if (props.user == null) return (<></>);
    return (
        <>
            <Card elevation={2}>
                <CardContent>
                    <Grid container>
                        {
                            Object.keys(props.user.data.grades).map((grade) => {
                                const c = props.user.data.grades[grade];
                                return (<>
                                    <Grid item xs={3} md={1.5} sx={{mb:'-11px'}}>
                                        <Box minHeight='100%' display='flex' alignItems='center' justifyContent='center'>
                                            <Box width='3rem' height='auto' component='img' src={getGradeIcon(grade)} />
                                            <Typography sx={{ml:1}} variant='h6'>{c.toLocaleString('en-US')}</Typography>
                                        </Box>
                                    </Grid>
                                </>)
                            })
                        }
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}

export default SectionGrades;