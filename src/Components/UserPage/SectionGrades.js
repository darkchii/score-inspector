import { Avatar, Box, Button, Card, CardContent, Chip, Container, Grid, Input, Modal, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from "@mui/material";
import ReactCountryFlag from "react-country-flag";
import { getGradeIcon, IMG_SVG_GRADE_X, IMG_SVG_GRADE_XH } from "../../Helpers/Assets";

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
                                    <Grid item xs={1.5}>
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