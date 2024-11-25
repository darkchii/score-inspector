import { Box } from "@mui/material";
import { fixedEncodeURIComponent } from "../../Helpers/Misc";

export const LEADERBOARD_ITEM_HEIGHT = 50;
export const LEADERBOARD_BORDER_RADIUS = '8px';

export function LeaderboardItem(props) {
    return (
        <Box sx={{
            height: LEADERBOARD_ITEM_HEIGHT,
            maxHeight: LEADERBOARD_ITEM_HEIGHT,
            width: "100%",
            position: 'relative',
            borderRadius: LEADERBOARD_BORDER_RADIUS,
            ...props.sx
        }}>
            <Box sx={{
                //Background color that fades out to the right
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundImage: `url(${fixedEncodeURIComponent(props.background)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: LEADERBOARD_BORDER_RADIUS,
                zIndex: -3
            }} />
            {
                props.backgroundColor ?
                    <Box sx={{
                        //Background color that fades out to the right halfways
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(to right, ${props.backgroundColor}, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))`,
                        borderRadius: LEADERBOARD_BORDER_RADIUS,
                        zIndex: -1
                    }} /> : <></>
            }

            <Box sx={{
                width: "100%",
                height: "100%",
                position: 'absolute',
                display: 'flex',
                borderRadius: LEADERBOARD_BORDER_RADIUS,
                transition: 'all 0.2s',
                '&:hover': {
                    transition: 'all 0.2s',
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    cursor: props.onClick ? 'pointer' : 'default'
                }
            }}
                onClick={props.onClick}
            >
                {props.children}
            </Box>
        </Box>
    );
}