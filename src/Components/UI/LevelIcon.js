import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { PNG_LEVEL_BADGE } from "../../Helpers/Assets";

function LevelIcon(props) {
    const _props = {
        size: 50,
        borderRadius: '50%',
        level: 100,
        levelProgress: 0,
        showLevelProgress: true,
        ...props
    }
    return (
        <Box sx={{
            position: 'relative',
            height: '100%',
            width: '100%',
        }}>
            <Box
                sx={{
                    position: 'absolute',
                    background: "-webkit-linear-gradient(-45deg, #8CF6FA, #F68DC4, #FEB887)",
                    maskImage: `url(${PNG_LEVEL_BADGE})`,
                    maskSize: 'cover',
                    aspectRatio: '1/1',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                }} />
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
            }}>
                <Tooltip title={`Level: ${_props.level}.${props.levelProgress}`}>
                    <Stack sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        //alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <Typography sx={{fontSize: 'calc(12px + 0.4vw)' }}>{_props.level}</Typography>
                        {
                            _props.showLevelProgress &&
                            <Typography variant='subtitle1' sx={{ fontSize: 10, lineHeight: '1em' }}>{_props.levelProgress}%</Typography>
                        }
                    </Stack>
                </Tooltip>
            </Box>
        </Box>
    )
}

export default LevelIcon;