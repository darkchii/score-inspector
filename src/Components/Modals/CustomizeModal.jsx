import { Box, Card, CardContent, Divider, FormControlLabel, FormGroup, Grid2, Modal, Stack, Switch, TextField, Typography } from "@mui/material";
import { useEffect, useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useState } from "react";
import { GetUser as GetInspectorUser, UpdateProfile } from "../../Helpers/Account";
import { showNotification, validateImage } from "../../Helpers/Misc";
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from "@mui/lab";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
};

function CustomizeModal(props, ref) {
    const [open, setOpen] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [optionBackgroundUrl, setOptionBackgroundUrl] = useState('');
    const [optionIsPrivateMode, setOptionIsPrivateMode] = useState(false);
    const [optionIsCompletionMode, setOptionIsCompletionMode] = useState(false);

    useImperativeHandle(ref, () => ({
        setOpen(value) {
            setOpen(value);
        }
    }));

    useEffect(() => {
        if (isWorking || !open) {
            return;
        }

        (async () => {
            setIsWorking(true);
            const user = await GetInspectorUser(props.account.user_id);
            setIsWorking(false);
            if (user === null) {
                showNotification('Error', 'Failed to get user data', 'error');
                setOpen(false);
            }
            setOptionBackgroundUrl(user.background_image);
            setOptionIsPrivateMode(user.is_private);
            setOptionIsCompletionMode(user.is_completion_mode);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const save = () => {
        // setOpen(false);
        if (isWorking) {
            return;
        }
        setIsWorking(false);
        (async () => {
            const validBackground = validateImage(optionBackgroundUrl);
            if (!validBackground) {
                showNotification('Error', 'Invalid background image', 'error');
                return;
            }

            try {
                const res = await UpdateProfile({
                    background_image: optionBackgroundUrl,
                    is_private: optionIsPrivateMode,
                    is_completion_mode: optionIsCompletionMode
                });

                if (res !== null && res.status === 200) {
                    showNotification('Success', 'Profile updated', 'success');
                    // setOpen(false);
                } else {
                    showNotification('Error', 'Failed to update profile', 'error');
                }
            } catch (err) {
                console.error(err);
                showNotification('Error', 'Failed to update profile', 'error');
            }

            setIsWorking(false);
        })();
    }

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={style}>
                    <Card sx={{ borderRadius: '10px' }}>
                        <CardContent>
                            <Typography variant='h4'>Edit profile</Typography>
                            <Stack spacing={2} direction='column' sx={{ pt: 1 }}>
                                <Grid2 container spacing={2}>
                                    <Grid2 size={3} sx={{ height: '200px' }}>
                                        <Box sx={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                            height: '100%',
                                            //align center
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '10px'
                                        }}>
                                            {
                                                optionBackgroundUrl !== '' && <>
                                                    <img
                                                        src={optionBackgroundUrl}
                                                        alt="Background"
                                                        style={{
                                                            maxWidth: '100%',
                                                            maxHeight: '100%',
                                                            borderRadius: '10px'
                                                        }} />
                                                </>
                                            }
                                        </Box>
                                    </Grid2>
                                    <Grid2 size={9}>
                                        <Stack spacing={2} direction='column' sx={{ pt: 1 }}>
                                            <TextField
                                                disabled={isWorking}
                                                onChange={(e) => setOptionBackgroundUrl(e.target.value)}
                                                value={optionBackgroundUrl}
                                                label="Background Image (URL)"
                                                variant="standard" />
                                            <Typography variant='caption'>Feel free to use suggestive content, just don&apos;t go over the top with full on naked anime girls.</Typography>
                                            <Divider sx={{ mt: 2, mb: 2 }} />
                                            <Grid2>
                                                <FormGroup component="fieldset" variant="standard">
                                                    {/* <FormControlLabel control={<Switch defaultChecked />} label="Private Mode" />
                                                    <FormControlLabel control={<Switch defaultChecked />} label="Completion Mode" /> */}
                                                    <FormControlLabel control={<Switch checked={optionIsPrivateMode} onChange={(e) => setOptionIsPrivateMode(e.target.checked)} />} label="Private Mode" />
                                                    <FormControlLabel disabled={optionIsPrivateMode} control={<Switch checked={optionIsCompletionMode} onChange={(e) => setOptionIsCompletionMode(e.target.checked)} />} label="Completion Mode" />
                                                </FormGroup>
                                            </Grid2>
                                        </Stack>
                                    </Grid2>
                                </Grid2>
                                <LoadingButton disabled={isWorking} loading={isWorking} onClick={save} startIcon={<SaveIcon />}>Save</LoadingButton>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Modal>
        </>
    )
}

export default forwardRef(CustomizeModal);