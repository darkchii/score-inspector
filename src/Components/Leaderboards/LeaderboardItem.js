import { Box } from "@mui/material";

export const LEADERBOARD_ITEM_HEIGHT = 64;
export const LEADERBOARD_BORDER_RADIUS = '15px';

export function LeaderboardItem(props) {
    return (
        <Box sx={{
            height: LEADERBOARD_ITEM_HEIGHT,
            maxHeight: LEADERBOARD_ITEM_HEIGHT,
            width: "100%",
            backgroundImage: `url(${props.background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            borderRadius: LEADERBOARD_BORDER_RADIUS
        }}>
            <Box sx={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                width: "100%",
                height: "100%",
                position: 'absolute',
                display: 'flex',
                borderRadius: LEADERBOARD_BORDER_RADIUS,
            }}>
                {props.children}
            </Box>
        </Box>
    );
}