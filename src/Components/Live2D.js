import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import ReactLive2d from 'react-live2d';

function Live2D(props) {
    const [release, setRelease] = useState(false)

    function handleClick() {
        setRelease(true)
        props.history.push({ pathname: "/Other" });
    }

    useEffect(() => {

    }, []);

    return (
        <>
            <ReactLive2d
                width={500}
                height={700}
                ModelList={['vanilla-teen']}
            />
        </>
    )
}
export default Live2D;