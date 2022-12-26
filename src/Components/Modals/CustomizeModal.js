import { Box, Button, Card, CardContent, Container, FormControl, FormControlLabel, FormGroup, Modal, Stack, Switch, TextField, Typography } from "@mui/material";
import { useEffect, useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useState } from "react";
import { GetUser as GetInspectorUser } from "../../Helpers/Account";
import { showNotification } from "../../Helpers/Misc";

const style = {
    position: 'absolute',
    top: '50%',
    width: '100%',
    transform: 'translate(0, -50%)',
};

function CustomizeModal(props, ref) {
    const [open, setOpen] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [userData, setUserData] = useState(null);
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
            setUserData(user);
            setIsWorking(false);
            if (user === null) {
                showNotification('Error', 'Failed to get user data', 'error');
                setOpen(false);
            }
            setBackgroundUrl(user.background_image);
        })();
    }, [open]);

    const save = () => {
        setOpen(false);
    }

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={style}>
                    <Container>
                        <Card sx={{ borderRadius: '10px' }}>
                            <CardContent>
                                <Typography variant='h4'>Edit profile</Typography>
                                <Stack spacing={2} direction='column'>
                                    {
                                        backgroundUrl !== '' && <>
                                            <img src={backgroundUrl} alt="Background" style={{ maxWidth: '300px', borderRadius: '10px' }} />
                                        </>
                                    }
                                    <TextField disabled={isWorking} onChange={(e) => setBackgroundUrl(e.target.value)} value={backgroundUrl} label="Background Image" variant="standard" />
                                    <Button onClick={save}>Save</Button>
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