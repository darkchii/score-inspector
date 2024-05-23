import { Box, Typography } from "@mui/material";
import GlowBar from "../UI/GlowBar";
import { LeaderboardItem } from "./LeaderboardItem";
import { useNavigate } from "react-router-dom";

function ClanLeaderboardItem(props) {
    const navigate = useNavigate();
    return (
        <>
            <LeaderboardItem
                background={props.clan.header_image_url ?? ''}
                onClick={() => {
                    navigate(`/clan/${props.clan?.id}`);
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100px'
                }}>
                    <Typography variant='h6' sx={{ fontSize: '1.3em' }} noWrap>
                        #{props.index}
                    </Typography>
                </Box>

                <Box sx={{
                    width: '5%',
                    position: 'relative',
                    p: 0,
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <Box sx={{ position: 'absolute', height: '100%', p: 1, pt: 2, pb: 2 }}>
                        <Box sx={{ position: 'relative', height: '100%' }}>
                            <GlowBar
                                size='6px'
                                color={`#${props.clan?.color}`}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ pl: 2 }}>
                        <Typography sx={{ color: `#${props.clan?.color}` }}>
                            {
                                `[${props.clan?.tag}]`
                            }
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                    width: '20%'
                }}>
                    <Box sx={{ pl: 2 }}>
                        <Typography>
                            {props.clan?.name}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'right',
                    alignItems: 'center',
                    flexGrow: 1,
                    pr: 1
                }}>
                    {
                        props.values?.map((value, index) => {
                            return (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: value.alignment,
                                    alignItems: 'center',
                                    width: `${100 / props.values.length}%`,
                                    pl: 1,
                                    pr: 1,
                                }}>
                                    <Typography
                                        sx={{
                                            color: value.color ?? 'inherit',
                                        }}
                                        variant={value.variant ?? 'h6'}
                                        textAlign={value.alignment}
                                        noWrap>
                                        {value.value}
                                    </Typography>
                                </Box>
                            )
                        })
                    }
                </Box>
            </LeaderboardItem>
        </>
    )
}

export default ClanLeaderboardItem;