import { Alert, Box, Button, Link } from "@mui/material";
import { GetOsuAuthUrl } from "../../Helpers/Misc";

function Login() {
    return (
        <Box sx={{p: 2}}>
            <Alert severity="warning">
                This is only for profile customization! Not score fetching. Visit the osu!alt discord for that.
            </Alert>
            <Button component={Link} href={GetOsuAuthUrl()} variant="contained" sx={{mt: 2}}>Login with osu!</Button>
        </Box>
    )
}

export default Login;