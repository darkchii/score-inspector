import { useEffect } from "react";
import { useState } from "react";
import { getBeatmapPacks } from "../../Helpers/Osu";
import { Box, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";

function SectionPacks(props) {
    const [packData, setPackData] = useState([])

    useEffect(() => {
        (async () => {
            const data = await getBeatmapPacks();
            console.log(data);
            let _packData = [];

            if (data) {
                let _data = {};
                for (let key in data) {
                    _data[key] = {
                        name: key,
                        sortName: parseInt(key.slice(1)),
                        total: data[key],
                        played: []
                    }
                }

                props.user.scores.forEach(score => {
                    if (score.beatmap === undefined) {
                        console.log("undefined beatmap", score);
                    } else {
                        let pack_id = score.beatmap.packs?.pack_id;
                        if (pack_id && _data[pack_id]) {
                            if (!_data[pack_id].played.includes(score.beatmap_id)) {
                                _data[pack_id].played.push(score.beatmap_id);
                            }
                        }
                    }
                });

                let data_arr = [];
                for (let key in _data) {
                    data_arr.push(_data[key]);
                }

                data_arr.sort((a, b) => a.sortName - b.sortName);

                _packData = data_arr;
            }

            setPackData(_packData);
        })();
    }, []);

    return (
        <>
            <Grid container spacing={0.5}>
                {
                    packData && packData.length > 0 ? packData.map(pack => {
                        return (
                            <Grid item xs={3}>
                                <Paper sx={{ height: '100%', position: 'relative' }}>
                                    <Stack direction='column'>
                                        <Box sx={{ p: 0.5, position: 'relative' }}>
                                            <Typography variant='body1' sx={{ float: 'left' }}>{pack.name} ({pack.played.length}/{pack.total})</Typography>
                                            <Typography variant='body1' sx={{ float: 'right' }}>{Math.round(pack.played.length / pack.total * 100)}%</Typography>
                                        </Box>
                                        <Box sx={{ width: '100%', position: 'relative', top: '2px' }}>
                                            <LinearProgress sx={{ height: '10px' }} variant='determinate' value={pack.played.length / pack.total * 100} />
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>
                        )
                    }) : <></>
                }
            </Grid>
        </>
    );
}

export default SectionPacks;