import { Box, Button, Card, CardContent, Container, Modal, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useState } from "react";
import { GetUser as GetInspectorUser, UpdateProfile } from "../../Helpers/Account";
import { showNotification, validateImage } from "../../Helpers/Misc";

const style = {
    position: 'absolute',
    top: '50%',
    width: '100%',
    transform: 'translate(0, -50%)',
};

function CustomizeModal(props, ref) {
    const [open, setOpen] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [backgroundUrl, setBackgroundUrl] = useState('');

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
            setBackgroundUrl(user.background_image);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const save = () => {
        // setOpen(false);
        if(isWorking){
            return;
        }
        setIsWorking(false);
        (async () => {
            const validBackground = validateImage(backgroundUrl);
            if (!validBackground) {
                showNotification('Error', 'Invalid background image', 'error');
                return;
            }

            const res = await UpdateProfile({
                background_image: backgroundUrl
            });

            if (res!==null && res.status === 200) {
                showNotification('Success', 'Profile updated', 'success');
                setOpen(false);
            } else {
                showNotification('Error', 'Failed to update profile', 'error');
            }
            setIsWorking(false);
        })();
    }

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={style}>
                    <Container>
                        <Card sx={{ borderRadius: '10px' }}>
                            <CardContent>
                                <Typography variant='h4'>Edit profile</Typography>
                                <Stack spacing={2} direction='column' sx={{pt:1}}>
                                    {
                                        backgroundUrl !== '' && <>
                                            <img src={backgroundUrl} alt="Background" style={{ maxWidth: '300px', borderRadius: '10px' }} />
                                        </>
                                    }
                                    <TextField
                                        disabled={isWorking}
                                        onChange={(e) => setBackgroundUrl(e.target.value)}
                                        value={backgroundUrl}
                                        label="Background Image (URL)"
                                        variant="standard" />
                                    <Button onClick={save}>Save</Button>
                                    <Typography variant='caption'>Feel free to use suggestive content, just don't go over the top with full on naked anime girls.</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Container>
                </Box>
            </Modal>
        </>
    )
}

export default forwardRef(CustomizeModal);