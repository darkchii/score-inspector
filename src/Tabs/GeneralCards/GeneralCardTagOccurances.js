import { Card, CardContent, Typography, Grid, TableContainer, Table, TableBody, TableRow, TableCell, Tooltip, Link } from '@mui/material';
import { useEffect, useState } from 'react';
import { TagCloud } from 'react-tagcloud';

function GeneralCardTagOccurances(props) {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (props.data.processed.usedTags) {
            const t = [];
            props.data.processed.usedTags.slice(0, 60).forEach((row) => {
                t.push({
                    value: row.tag,
                    count: row.value,
                });
            });
            setTags(t);
        }
    }, [props.data]);

    return (
        <>
            <Card sx={{ height: "100%" }}>
                <CardContent>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item sx={{ width: '100%' }}>
                            <Typography color="textPrimary">tag occurances ({props.data.processed.usedTags.length.toLocaleString("en-US")} total)</Typography>
                            <TagCloud colorOptions={{ luminosity: 'light', hue: 'blue' }} minSize={12} maxSize={35} tags={tags} renderer={(tag, size, color) => {
                                return (
                                    <Tooltip title={`${tag.count.toLocaleString('en-US')} beatmaps`}>
                                        <Typography sx={{ fontSize: size, color: color }} style={{ display: 'inline-block' }}>
                                            {tag.value}&nbsp;
                                        </Typography>
                                    </Tooltip>
                                )
                            }} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
}
export default GeneralCardTagOccurances;