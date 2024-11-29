import { Height } from "@mui/icons-material";
import { styled, Tabs } from "@mui/material";

const OsuTabs = styled((props) => <Tabs disableRipple {...props} />)(
    ({ theme }) => ({
        boxShadow: 'none',
        height: '16px !important',
        minWidth: 0,
        marginRight: theme.spacing(1),
        "& .MuiTabs-indicator": {
            justifyContent: "center",
            height: '2px',
            borderRadius: '10px',
        },
        //dont change text color on selected tab
        "& .Mui-selected": {
            color: theme.palette.text.primary,
        },
    })
);

export default OsuTabs;