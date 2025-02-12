import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GetClanList } from "../../Helpers/Clan";
import { showNotification } from "../../Helpers/Misc";
import { Box, Button, ButtonGroup, Divider, FormControl, Grid2, IconButton, InputAdornment, InputLabel, OutlinedInput, Pagination, Stack } from "@mui/material";
import ClanLeaderboardItem from "../Leaderboards/ClanLeaderboardItem";
import CLAN_STATS_MAP from "./ClanStatsMap";
import { grey } from "@mui/material/colors";
import { DiscordIcon } from "../Icons";
import StatCard from "../UI/StatCard";
import Loader from "../UI/Loader";
import GroupsIcon from '@mui/icons-material/Groups';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SearchIcon from '@mui/icons-material/Search';

const CLANS_PER_PAGE = 20;
function ClanList() {
    const [clanListData, setClanListData] = useState(null);
    const [sorter, setSorter] = useState('average_pp');
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const fetchData = async (reset_page = false) => {
        try {
            if (reset_page) setPage(1);
            const _page = reset_page ? 1 : page;
            setClanListData(null);
            const response = await GetClanList(_page, sorter, 'desc', CLANS_PER_PAGE, searchQuery);
            if (response?.total_clans) {
                response.total_pages = Math.ceil(response.query_clans / CLANS_PER_PAGE);
                response.current_page = _page;
                setClanListData(response);
            }
        } catch (err) {
            console.error(err);
            showNotification('Error', 'An error occurred while fetching the clan list.', 'error');
        }
    }

    useEffect(() => {
        window.onTitleChange('Clans');
        (async () => {
            await fetchData();
        })()
    }, [sorter, page]);

    return (
        <>
            {
                clanListData ?
                    <>
                        <Grid2 container spacing={1}>

                            <Grid2 size={{ xs: 12, md: 10 }}>
                                <Pagination
                                    color="primary"
                                    count={clanListData.total_pages}
                                    page={clanListData.current_page}
                                    showFirstButton
                                    showLastButton
                                    siblingCount={1}
                                    boundaryCount={1}
                                    onChange={(e, page) => setPage(page)}
                                    sx={{
                                        mt: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                />
                                <Stack direction='column' spacing={0.6} sx={{
                                    mt: 1
                                }}>
                                    {
                                        clanListData.clans.map((clan, index) => {
                                            return (
                                                <ClanLeaderboardItem
                                                    key={index}
                                                    index={index + 1 + (clanListData.current_page - 1) * CLANS_PER_PAGE}
                                                    clan={clan}
                                                    onClick={() => navigate(`/clan/${clan.id}`)}
                                                    values={
                                                        [
                                                            //empty
                                                            { value: '', alignment: 'left', variant: 'body2' },
                                                            { value: '', alignment: 'left', variant: 'body2' },
                                                            //select stat name from clan_stats entry
                                                            {
                                                                value: CLAN_STATS_MAP.find((stat) => stat.key === sorter).name, alignment: 'right', variant: 'body2',
                                                                color: grey[500]
                                                            },
                                                            //select clan_stat entry from sorter, then use format function
                                                            { value: CLAN_STATS_MAP.find((stat) => stat.key === sorter).format(clan.clan_stats), alignment: 'left', variant: 'body2' },
                                                            //only if extra_format is set
                                                            ...[CLAN_STATS_MAP.find((stat) => stat.key === sorter).extra_format ? {
                                                                value: CLAN_STATS_MAP.find((stat) => stat.key === sorter).extra_format(clan.clan_stats),
                                                                alignment: 'left',
                                                                variant: 'body2',
                                                                color: grey[500]
                                                            } : {}]
                                                        ]
                                                    }
                                                    iconValues={[
                                                        { value: (!clan.discord_invite || clan.discord_invite.length === 0) ? <></> : <DiscordIcon sx={{ color: grey[200] }} />, alignment: 'right', variant: 'body2', tooltip: clan.discord_invite ? 'Has a Discord community' : '' },
                                                        { value: clan.disable_requests ? <LockIcon color='error' /> : <LockOpenIcon color='success' />, alignment: 'right', variant: 'body2', tooltip: clan.disable_requests ? 'Join requests disabled' : 'Join requests enabled' }
                                                    ]}
                                                />
                                            )
                                        })
                                    }
                                </Stack>
                                <Pagination
                                    color="primary"
                                    count={clanListData.total_pages}
                                    page={clanListData.current_page}
                                    showFirstButton
                                    showLastButton
                                    siblingCount={1}
                                    boundaryCount={1}
                                    onChange={(e, page) => setPage(page)}
                                    sx={{
                                        mt: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 2 }}>
                                <Box sx={{ mt: 1 }}>
                                    <Grid2 container spacing={1}>
                                        <Grid2 size={6}>
                                            <StatCard stats={clanListData?.total_clans ?? 0} title='Clans' color={grey} opacity={0.2} icon={<GroupsIcon />} />
                                        </Grid2>
                                        <Grid2 size={6}>
                                            <StatCard stats={clanListData?.total_members ?? 0} title='Members' color={grey} opacity={0.2} icon={<GroupsIcon />} />
                                        </Grid2>
                                    </Grid2>
                                </Box>
                                {/* search field with button right */}
                                <Box sx={{
                                    display: 'flex',
                                    mt: 1,
                                }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel
                                            htmlFor='clan-search'
                                        >Search</InputLabel>
                                        <OutlinedInput
                                            id='clan-search'
                                            type='text'
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => fetchData(true)}
                                                    >
                                                        <SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label='Search clan'
                                        />
                                    </FormControl>
                                </Box>
                                <Divider sx={{ mt: 1, mb: 1 }} />
                                <ButtonGroup sx={{ mt: 1 }} orientation="vertical" color='primary' fullWidth>
                                    {
                                        CLAN_STATS_MAP.filter((stat) => stat.clanlist !== false).map((stat, index) => {
                                            return (
                                                <Button
                                                    key={index}
                                                    onClick={() => setSorter(stat.key)}
                                                    variant={sorter === stat.key ? 'contained' : 'outlined'}
                                                >
                                                    {stat.name}
                                                </Button>
                                            )
                                        })
                                    }
                                </ButtonGroup>
                            </Grid2>
                        </Grid2>
                    </> : <Loader />
            }
        </>
    )
}

export default ClanList;