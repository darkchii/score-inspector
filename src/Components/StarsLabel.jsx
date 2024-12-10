import StarIcon from '@mui/icons-material/Star';
import { formatNumber } from "../Helpers/Misc";
import { getDiffColor } from "../Helpers/Osu";

function StarsLabel(props) {
    const { stars } = props;
    return (
        <div className={`difficulty-badge ${stars > 6.5 ? 'difficulty-badge__expert-plus' : ''}`} style={{
            '--bg': getDiffColor(stars),
            ...props.style
        }}>
            <span className='difficulty-badge__icon'>
                <StarIcon />
            </span>
            <span className='difficulty-badge__rating'>
                {formatNumber(stars, 2)}
            </span>
        </div>
        // <Box sx={{ 
        //     display: 'flex', 
        //     alignItems: 'center', 
        //     height: '100%',
        //     backgroundColor: red[500],
        //     borderRadius: '1000000px',
        //     color: 'black',
        //     m: 0.5,
        //     }}>
        //     <Typography sx={{ fontSize: '1em' }}>{stars.toFixed(2)}*</Typography>
        // </Box>
    )
}

export default StarsLabel;