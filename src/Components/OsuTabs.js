import { Height } from "@mui/icons-material";
import { styled, Tabs } from "@mui/material";

const OsuTabs = styled((props) => <Tabs disableRipple {...props} TabIndicatorProps={{ children: <span /> }} />)(
    ({ theme }) => ({
        minWidth: 0,
        marginRight: theme.spacing(1),
        "& .MuiTabs-indicator": {
            display: "flex",
            justifyContent: "center",
            height: '2px',
            borderRadius: '10px',
            '& > span': {
                width: '50%',
                maxWidth: '30px',
                backgroundColor: theme.palette.primary.main,
            },
        },
    })
);

export default OsuTabs;