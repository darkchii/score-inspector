import { Typography } from '@mui/material';

function Error() {
    return (
        <>
            <Typography variant="h5" component="h5">Error</Typography>
            <Typography variant="body1" component="p">Nothing here</Typography>
            <img src='https://img3.gelbooru.com/images/9c/12/9c12c7b9f31ba40976539adf14656651.jpg' alt='404' 
                style={{
                    width: '300px',
                    height: 'auto',
                    display: 'block',
                }}
            />
        </>
    );
}

export default Error;