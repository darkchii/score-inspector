import { Avatar, Box, Chip, Grid, Stack, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableRow, Tooltip, Typography } from "@mui/material";
import ReactCountryFlag from "react-country-flag";

function SectionHeader(props) {
    if (props.user == null) return (<></>);
    return (
        <>
            <Grid container sx={{
                backgroundImage: `url(${props.user.osu.cover_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '11px'
            }}>
                <Box sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    width: '100%',
                    borderRadius: '10px',
                }}>
                    <Grid container spacing={3} alignItems='center'>
                        <Grid item xs={2}>
                            <Avatar src={`https://a.ppy.sh/${props.user.osu.id}`} alt='avatar' sx={{ height: '8rem', width: '8rem', m: 1 }} />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography variant='h4'>{props.user.osu.username}</Typography>
                            <Stack alignItems='center' direction='row' spacing={1}>
                                <ReactCountryFlag style={{ lineHeight: '1em', fontSize: '1.4em', borderRadius: '5px' }} cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/" countryCode={props.user.osu.country.code} />
                                <Typography variant='h6'>{props.user.osu.country.name}</Typography>
                                {
                                    props.user.osu.groups.length > 0 ? <>
                                        {
                                            props.user.osu.groups.map((group, index) => {
                                                return (
                                                    <>
                                                        <Tooltip title={group.name}>
                                                            <Chip size='small' sx={{ m: 0.2, backgroundColor: `${group.colour}aa` }} label={group.short_name} />
                                                        </Tooltip>
                                                    </>
                                                )
                                            })
                                        }
                                    </> : <></>
                                }
                            </Stack>
                            <Typography variant='h6'>{Math.round(props.user.osu.statistics.pp).toLocaleString('en-US')}pp <Tooltip title='Sum of pp from every set score'><span>({Math.round(props.user.data?.total.pp ?? 0).toLocaleString('en-US')}pp total)</span></Tooltip></Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <TableContainer>
                                <Table size='small' sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none", fontSize: '0.75em', lineHeight: '0.5em' } }}>
                                    <TableBody>
                                        <TableRow><TableCell>World</TableCell><TableCell>#{(props.user.osu.statistics.global_rank ?? 0).toLocaleString('en-US')}</TableCell></TableRow>
                                        <TableRow><TableCell>Country</TableCell><TableCell>#{(props.user.osu.statistics.country_rank ?? 0).toLocaleString('en-US')}</TableCell></TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={3}>
                            <TableContainer>
                                <Table size='small' sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none", fontSize: '0.75em', lineHeight: '0.5em' } }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Top 1s</TableCell>
                                            <TableCell>{(props.user.data.leaderboardStats?.top1s ?? 0).toLocaleString('en-US')}</TableCell>
                                            <TableCell>#{(props.user.data.leaderboardStats?.top1s_rank ?? 0).toLocaleString('en-US')}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Top 8s</TableCell>
                                            <TableCell>{(props.user.data.leaderboardStats?.top8s ?? 0).toLocaleString('en-US')}</TableCell>
                                            <TableCell>#{(props.user.data.leaderboardStats?.top8s_rank ?? 0).toLocaleString('en-US')}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Top 25s</TableCell>
                                            <TableCell>{(props.user.data.leaderboardStats?.top25s ?? 0).toLocaleString('en-US')}</TableCell>
                                            <TableCell>#{(props.user.data.leaderboardStats?.top25s_rank ?? 0).toLocaleString('en-US')}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Top 50s</TableCell>
                                            <TableCell>{(props.user.data.leaderboardStats?.top50s ?? 0).toLocaleString('en-US')}</TableCell>
                                            <TableCell>#{(props.user.data.leaderboardStats?.top50s_rank ?? 0).toLocaleString('en-US')}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Top 100s</TableCell>
                                            <TableCell>{(props.user.data.leaderboardStats?.top100s ?? 0).toLocaleString('en-US')}</TableCell>
                                            <TableCell>#{(props.user.data.leaderboardStats?.top100s_rank ?? 0).toLocaleString('en-US')}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </>
    )
}

export default SectionHeader;