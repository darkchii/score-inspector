import { Alert, Box, Button, Link, ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import { GetOsuAuthUrl } from "../../Helpers/Misc";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

function AccountDropdown(props) {
    const navigate = useNavigate();

    const closeMenu = () => {
        props.onClose?.();
    }

    return (
        <Box sx={{ p: 2 }}>
            <Alert severity="info">Welcome, {props.account.username}</Alert>
            <MenuList>
                <MenuItem onClick={() => { navigate(`/user/${props.account.user_id}`); closeMenu(); }}>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { navigate(`/logout`); closeMenu(); }}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </MenuList>
        </Box>
    )
}

export default AccountDropdown;