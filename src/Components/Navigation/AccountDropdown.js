import { Alert, Box, ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import FilterIcon from '@mui/icons-material/Filter';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useNavigate } from 'react-router-dom';
import PlayerCard from "../PlayerCard";

function AccountDropdown(props) {
    const navigate = useNavigate();

    const closeMenu = () => {
        props.onClose?.();
    }

    return (
        <Box sx={{ p: 2 }}>
            {
                props.account.osu_user ? <>
                    <PlayerCard 
                        user={props.account.osu_user}
                        onClick={() => { navigate(`/user/${props.account.user_id}`); closeMenu(); }}
                        />
                </> : <>
                    <Alert severity="info">Welcome, {props.account.username}</Alert>
                </>
            }
            <MenuList>
                <MenuItem key={'profile'} onClick={() => { navigate(`/user/${props.account.user_id}`); closeMenu(); }}>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem key={'customize'} onClick={() => { props.customizeModal.current.setOpen(true); closeMenu(); }}>
                    <ListItemIcon><FilterIcon /></ListItemIcon>
                    <ListItemText>Customize</ListItemText>
                </MenuItem>
                <MenuItem key={'visited'} onClick={() => { props.visitorLogModal.current.setOpen(true); closeMenu(); }}>
                    <ListItemIcon><PersonSearchIcon /></ListItemIcon>
                    <ListItemText>Visited</ListItemText>
                </MenuItem>
                <MenuItem key={'logout'} onClick={() => { navigate(`/logout`); closeMenu(); }}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </MenuList>
        </Box>
    )
}

export default AccountDropdown;