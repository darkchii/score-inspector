import { Avatar, Box, Button, Card, CardContent, Container, FormControl, FormControlLabel, FormGroup, Input, Modal, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useState } from "react";
import { findUsers } from "../../Helpers/OsuAlt";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom/dist";
import ReactCountryFlag from "react-country-flag";
import { getSettings, saveSettings } from "../../Helpers/Settings";

const style = {
    position: 'absolute',
    top: '50%',
    width: '100%',
    transform: 'translate(0, -50%)',
};

function SettingsModal(props, ref) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const [settings, setSettings] = useState(getSettings());

    useImperativeHandle(ref, () => ({
        setOpen(value) {
            setOpen(value);
        }
    }));

    const save = () => {
        saveSettings(settings);
        setOpen(false);
    }

    const setOption = (key, value) => {
        setSettings({
            ...settings,
            [key]: value
        });
    }

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={style}>
                    <Container>
                        <Card sx={{ borderRadius: '10px' }}>
                            <CardContent>
                                <Typography variant='h4'>Settings</Typography>
                                <Stack spacing={2} direction='column'>
                                    <FormControl component="fieldset" variant="standard">
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={settings.snowFall}
                                                        onChange={e => setOption('snowFall', e.target.checked)}
                                                        name="snow" />
                                                }
                                                label="Snow Mode"
                                            />
                                        </FormGroup>
                                    </FormControl>
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

export default forwardRef(SettingsModal);