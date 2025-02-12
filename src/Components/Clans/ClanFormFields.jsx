import { matchIsValidColor, MuiColorInput } from "mui-color-input";
import { useEffect, useState } from "react";
import { MODAL_STYLE, showNotification } from "../../Helpers/Misc";
import { Alert, Box, Button, Card, Container, Divider, FormControl, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from "@mui/material";
import { GetFormattedName } from "../../Helpers/Account";
import CLAN_STATS_MAP from "./ClanStatsMap";

function ClanFormFields(props) {
    const [isWorking, setIsWorking] = useState(false);
    const [clanName, setClanName] = useState(props.clan?.clan.name ?? '');
    const [clanTag, setClanTag] = useState(props.clan?.clan.tag ?? '');
    const [clanDescription, setClanDescription] = useState(props.clan?.clan.description ?? '');
    const [clanColor, setClanColor] = useState(('#' + (props.clan?.clan.color ?? 'ffffff')));
    const [clanLogoUrl, setClanLogoUrl] = useState(props.clan?.clan.logo_image_url ?? '');
    const [clanHeaderUrl, setClanHeaderUrl] = useState(props.clan?.clan.header_image_url ?? '');
    const [clanBackgroundUrl, setClanBackgroundUrl] = useState(props.clan?.clan.background_image_url ?? '');
    const [clanDisableRequests, setClanDisableRequests] = useState(props.clan?.clan.disable_requests ?? false);
    const [clanDisableLogs, setClanDisableLogs] = useState(props.clan?.clan.disable_logs ?? false);
    const [clanDefaultSort, setClanDefaultSort] = useState(props.clan?.clan.default_sort ?? 'average_pp');
    const [clanDiscordInvite, setClanDiscordInvite] = useState(props.clan?.clan.discord_invite ?? '');
    const [isEditMode] = useState(props.clan ? true : false);

    const [exampleUser, setExampleUser] = useState(null);

    const onUpdate = () => {
        let user = { ...props.user };
        user.clan_member = {};
        user.clan_member.clan = {
            tag: clanTag,
            //without hashtag
            color: clanColor.substring(1),
        }
        setExampleUser(user);
    }

    useEffect(() => {
        onUpdate();
    }, [clanTag, clanColor]);

    useEffect(() => {
        setIsWorking(false);
        onUpdate();
    }, []);

    const onSubmit = () => {
        if (isWorking) {
            return;
        }
        setIsWorking(true);
        //submit the clan
        (async () => {
            if (!matchIsValidColor(clanColor)) {
                showNotification('Error', 'Invalid color code.', 'error');
                setIsWorking(false);
                return;
            }

            await props.onSubmit({
                clanName: clanName,
                clanTag: clanTag,
                clanDescription: clanDescription,
                clanColor: clanColor.substring(1),
                clanLogoUrl: clanLogoUrl,
                clanHeaderUrl: clanHeaderUrl,
                clanBackgroundUrl: clanBackgroundUrl,
                clanDisableRequests: clanDisableRequests,
                clanDisableLogs: clanDisableLogs,
                clanDefaultSort: clanDefaultSort,
                clanDiscordInvite: clanDiscordInvite,
            });

            setIsWorking(false);
        })();
    }

    return (
        <>
            <Card sx={{
                ...MODAL_STYLE,
                maxHeight: '90vh',
                height: '90vh',
            }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    overflowY: 'auto',
                }}>
                    {/* <Typography variant='h6'>Create a clan</Typography> */}
                    {/* FORM */}
                    <Box sx={{
                        position: 'relative',
                        padding: 2,
                    }}>
                        <Container>
                            <Stack spacing={1}>
                                <Typography variant='h6'>{isEditMode ? 'Edit' : 'Create'} clan</Typography>
                                <Divider />
                                {
                                    exampleUser && GetFormattedName(exampleUser)
                                }
                                <TextField
                                    label='Clan name'
                                    variant='standard'
                                    value={clanName}
                                    onChange={(e) => setClanName(e.target.value)}
                                    disabled={isWorking}
                                    inputProps={{
                                        maxLength: 20,
                                    }}
                                />
                                <TextField
                                    label='Clan tag'
                                    variant='standard'
                                    value={clanTag}
                                    onChange={(e) => setClanTag(e.target.value)}
                                    disabled={isWorking}
                                    inputProps={{
                                        maxLength: 5,
                                    }}
                                />
                                <TextField
                                    label='Clan description'
                                    variant='standard'
                                    value={clanDescription}
                                    onChange={(e) => setClanDescription(e.target.value)}
                                    disabled={isWorking}
                                    inputProps={{
                                        maxLength: 100,
                                    }}
                                />
                                <MuiColorInput
                                    label='Clan color'
                                    format='hex'
                                    value={clanColor}
                                    isAlphaHidden={true}
                                    onChange={(color) => setClanColor(color)}
                                    variant="standard"
                                />
                                {
                                    isEditMode ? <>
                                        <TextField
                                            label='Discord Invite'
                                            variant='standard'
                                            value={clanDiscordInvite}
                                            onChange={(e) => setClanDiscordInvite(e.target.value)}
                                            disabled={isWorking}
                                            inputProps={{
                                                maxLength: 255,
                                            }} />

                                        <TextField
                                            label='Logo Image URL (Square image recommended)'
                                            variant='standard'
                                            value={clanLogoUrl}
                                            onChange={(e) => setClanLogoUrl(e.target.value)}
                                            disabled={isWorking}
                                            inputProps={{
                                                maxLength: 255,
                                            }}
                                        />

                                        <TextField
                                            label='Header Image URL (1152x200 is best fit for clan page on desktop, but it resizes to fit everywhere)'
                                            variant='standard'
                                            value={clanHeaderUrl}
                                            onChange={(e) => setClanHeaderUrl(e.target.value)}
                                            disabled={isWorking}
                                            inputProps={{
                                                maxLength: 255,
                                            }}
                                        />

                                        <TextField
                                            label='Background Image URL'
                                            variant='standard'
                                            value={clanBackgroundUrl}
                                            onChange={(e) => setClanBackgroundUrl(e.target.value)}
                                            disabled={isWorking}
                                            inputProps={{
                                                maxLength: 255,
                                            }}
                                        />

                                        <Box sx={{
                                            width: '100%',
                                        }}>
                                            <FormControl sx={{
                                                mt: 1,
                                                width: '100%',
                                            }}>
                                                <InputLabel id="edit-default-sort">Default Sort</InputLabel>
                                                <Select
                                                    labelId="edit-default-sort"
                                                    id="edit-default-sort-select"
                                                    variant='standard'
                                                    size="small"
                                                    value={clanDefaultSort}
                                                    onChange={(e) => setClanDefaultSort(e.target.value)}
                                                    disabled={isWorking}
                                                >
                                                    {
                                                        CLAN_STATS_MAP.filter((stat) => stat.user !== false).map((stat, i) => {
                                                            return (
                                                                <MenuItem key={i} value={stat.key}>{stat.name}</MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Box>

                                        {/* MUI switch */}
                                        <Stack direction='row' alignItems='center'>
                                            <Switch
                                                checked={clanDisableRequests}
                                                onChange={(e) => setClanDisableRequests(e.target.checked)}
                                                disabled={isWorking}
                                            />
                                            <Typography>Disable join requests</Typography>
                                        </Stack>

                                        <Stack direction='row' alignItems='center'>
                                            <Switch
                                                checked={clanDisableLogs}
                                                onChange={(e) => setClanDisableLogs(e.target.checked)}
                                                disabled={isWorking}
                                            />
                                            <Typography>Disable logs from public</Typography>
                                        </Stack>
                                    </> : <></>
                                }
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={onSubmit}
                                    disabled={isWorking}
                                >
                                    {isEditMode ? 'Update' : 'Create'}
                                </Button>
                                <Alert severity='info' sx={{ mt: 1 }}>
                                    Header and background image must be a direct link to an image. (e.g. https://i.imgur.com/LqGgC4a.jpeg)
                                </Alert>
                                {/* add header image preview */}
                                <Typography variant='body2'>Logo Image Preview</Typography>
                                {
                                    clanLogoUrl ? <img src={clanLogoUrl} alt="Logo Preview" style={{
                                        width: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                        marginTop: '5px',
                                    }} /> : <Alert severity='info' sx={{ mt: 1 }}>No logo image</Alert>
                                }
                                <Divider sx={{ mt: 1, mb: 1 }} />
                                <Typography variant='body2'>Header Image Preview</Typography>
                                {
                                    clanHeaderUrl ? <img src={clanHeaderUrl} alt="Header Preview" style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                        marginTop: '5px',
                                    }} /> : <Alert severity='info' sx={{ mt: 1 }}>No header image</Alert>
                                }
                                <Divider sx={{ mt: 1, mb: 1 }} />
                                <Typography variant='body2'>Background Image Preview</Typography>
                                {
                                    clanBackgroundUrl ? <img src={clanBackgroundUrl} alt="Background Preview" style={{
                                        width: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                        marginTop: '5px',
                                    }} /> : <Alert severity='info' sx={{ mt: 1 }}>No background image</Alert>
                                }
                            </Stack>
                        </Container>
                    </Box>
                </div>
            </Card>
        </>
    );
}

export default ClanFormFields;