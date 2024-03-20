import { useEffect, useState } from "react";
import { getBeatmaps } from "../Misc/API";
import { Alert } from "@mui/material";

const LIMIT = 25;

function RouteBeatmaps() {
    const [beatmaps, setBeatmaps] = useState(null);
    const [page, setPage] = useState(1);

    const loadBeatmaps = async (page, filter) => {
        let response = await getBeatmaps({
            limit: LIMIT,
            offset: (page - 1) * LIMIT,
            ...filter
        });
        setBeatmaps(response);
    }

    useEffect(() => {
        (async () => {
            await loadBeatmaps(page, {});
        })();
    }, []);

    return (
        <>
            {
                !beatmaps ? <>
                    <Alert severity="warning">Loading beatmaps...</Alert>
                </> : <>
                    <Alert severity="success">Loaded beatmaps</Alert>
                </>
            }
        </>
    )
}

export default RouteBeatmaps;