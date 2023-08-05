import { Box, Stack, Tooltip } from "@mui/material";
import { PNG_LEVEL_BADGE } from "../../Helpers/Assets";
import ScaleText from "react-scale-text";

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
            maxHeight: '100%',
            aspectRatio: '1/1',
            height: 'auto',
            width: 'auto',
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            contentAlign: 'center',
        }}>
            <Box
                sx={{
                    position: 'absolute',
                    background: "-webkit-linear-gradient(-45deg, #8CF6FA, #F68DC4, #FEB887)",
                    maskImage: `url(${PNG_LEVEL_BADGE})`,
                    maskSize: 'cover',
                    height: '100%',
                    aspectRatio: '1/1',
                    width: 'auto',
                    display: 'flex',
                }} />
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                width: '55%',
                height: '55%',
                flexDirection: 'column',
                textAlign: 'center',
                alignContent: 'center'
            }}>
                <Tooltip title={`Level: ${_props.level}.${props.levelProgress}`} sx={{ width: '100%', height: '100%' }}>
                    <Stack sx={{ width: '100%', height: '100%' }}>
                        <ScaleText>
                            {_props.level}
                        </ScaleText>
                    </Stack>
                </Tooltip>
            </Box>
        </Box>
    )
}

export default LevelIcon;