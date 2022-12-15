import { Typography } from '@mui/material';
import React from 'react';
import { useRouteError } from 'react-router-dom/dist';

function Error() {
    return (
        <>
            <Typography variant="h5" component="h5">Error</Typography>
            <Typography variant="body1" component="p">Nothing here</Typography>
        </>
    );
}

export default Error;