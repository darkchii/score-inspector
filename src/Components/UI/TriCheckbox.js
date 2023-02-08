import { Checkbox } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";

function TriCheckbox(props) {
    const [checked, setChecked] = useState(props?.checked ?? null);

    const nextState = () => {
        if (checked === null) {
            setChecked(true);
        } else if (checked === true) {
            setChecked(false);
        } else {
            setChecked(null);
        }

        props.checked = checked;
    };

    useEffect(() => {
        props?.onChange?.(checked);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checked]);

    useEffect(()=>{
        setChecked(props.checked);
    }, [props?.checked]);

    return (
        <>
            <Checkbox onClick={() => nextState()} indeterminate={checked === null} checked={checked} />
        </>
    );
}

export default TriCheckbox;