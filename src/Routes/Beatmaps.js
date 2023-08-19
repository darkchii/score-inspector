import { Grid } from "@mui/material";
import BeatmapFilter from "../Components/UserPage/BeatmapFilter";

function Beatmaps(props){
    // const [beatmaps, setBeatmaps] = useState([]);

    return (
        <div>
            <h1>Beatmaps</h1>
            <Grid container>
                <BeatmapFilter />
            </Grid>
        </div>
    )
}

export default Beatmaps;