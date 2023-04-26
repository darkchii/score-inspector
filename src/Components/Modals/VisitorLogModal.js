import { Box, Button, Card, CardContent, Container, FormControl, FormControlLabel, FormGroup, Modal, Stack, Switch, Typography } from "@mui/material";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useState } from "react";
import { getSettings, saveSettings } from "../../Helpers/Settings";

const style = {
    position: 'absolute',
    top: '50%',
    width: '100%',
    transform: 'translate(0, -50%)',
};

function VisitorLogModal(props, ref) {
    const [open, setOpen] = useState(false);

    const [settings, setSettings] = useState(getSettings());

    useImperativeHandle(ref, () => ({
        setOpen(value) {
            setOpen(value);
        }
    }));

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
                                <Typography variant='h6'>Users visited</Typography>
                                <Stack spacing={2} direction='column'>
                                    
                                </Stack>
                            </CardContent>
                        </Card>
                    </Container>
                </Box>
            </Modal>
        </>
    )
}

export default forwardRef(VisitorLogModal);